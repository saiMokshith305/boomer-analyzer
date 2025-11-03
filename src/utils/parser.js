/**
 * Parser for SubProduct Configuration JSON
 */

export const parseExportFile = (content) => {
  try {
    let jsonData;
    
    // Try to parse as JSON
    try {
      jsonData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return null;
    }

    // Check if it's a SubProduct configuration
    if (jsonData.type === 'SubProductDto') {
      return parseSubProductDto(jsonData);
    }

    // If it's already in our format, return it
    if (jsonData.attributes && jsonData.rules) {
      return jsonData;
    }

    return null;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
};

/**
 * Parse SubProduct DTO into our internal format
 */
const parseSubProductDto = (dto) => {
  const attributes = [];
  const rules = [];
  const availabilities = [];
  const calculations = [];
  const entities = [];
  const layouts = [];
  const statistics = {
    totalEntities: 0,
    totalAttributes: 0,
    totalRules: 0,
    totalCalculations: 0,
    totalAvailabilities: 0,
    highImpactAttributes: []
  };

  // Parse Risk Entities and their Attributes
  if (dto.riskEntityModels) {
    dto.riskEntityModels.forEach(entity => {
      const entityData = {
        id: entity.uniqueId,
        name: entity.name,
        reference: entity.reference,
        type: 'entity',
        typeCode: entity.typeCode,
        attributes: []
      };

      if (entity.attributeModels) {
        entity.attributeModels.forEach(attr => {
          const attrId = `${entity.reference}_${attr.reference}`;
          const attribute = {
            id: attrId,
            name: attr.defaultDescription || attr.dictionaryKey,
            reference: attr.reference,
            dictionaryKey: attr.dictionaryKey,
            dataType: attr.typeCode,
            precision: attr.precision,
            entityReference: entity.reference,
            entityName: entity.name,
            type: 'attribute',
            usedIn: {
              rules: [],
              calculations: [],
              availabilities: []
            }
          };

          attributes.push(attribute);
          entityData.attributes.push(attrId);
          statistics.totalAttributes++;
        });
      }

      entities.push(entityData);
      statistics.totalEntities++;
    });
  }

  // Parse Rules
  if (dto.ruleModels) {
    dto.ruleModels.forEach(rule => {
      const ruleData = {
        id: rule.uniqueId,
        name: rule.name,
        dictionaryKey: rule.dictionaryKey,
        description: rule.description,
        type: 'rule',
        executionLevel: rule.executionLevel,
        result: rule.result,
        scriptReference: rule.script,
        groovyScript: dto.multilineScripts?.[rule.dictionaryKey] || 'Script not available',
        references: extractAttributeReferences(rule.script, attributes),
        impactLevel: determineImpactLevel(rule.executionLevel)
      };

      // Update attribute usage
      ruleData.references.forEach(ref => {
        const attr = attributes.find(a => a.reference === ref || a.dictionaryKey === ref);
        if (attr) {
          attr.usedIn.rules.push(rule.uniqueId);
        }
      });

      rules.push(ruleData);
      statistics.totalRules++;
    });
  }

  // Parse Calculations
  if (dto.calculationModels) {
    dto.calculationModels.forEach(calc => {
      const calcData = {
        id: calc.uniqueId,
        name: calc.name,
        dictionaryKey: calc.dictionaryKey,
        description: calc.description,
        type: 'calculation',
        scriptReference: calc.script,
        groovyScript: dto.multilineScripts?.[calc.dictionaryKey] || 'Script not available',
        references: extractAttributeReferences(calc.script, attributes),
        returnType: 'Unknown'
      };

      // Update attribute usage
      calcData.references.forEach(ref => {
        const attr = attributes.find(a => a.reference === ref || a.dictionaryKey === ref);
        if (attr) {
          attr.usedIn.calculations.push(calc.uniqueId);
        }
      });

      calculations.push(calcData);
      statistics.totalCalculations++;
    });
  }

  // Parse Availabilities
  if (dto.availabilityModels) {
    dto.availabilityModels.forEach(avail => {
      const availData = {
        id: avail.uniqueId,
        name: avail.name,
        type: 'availability',
        componentPartCode: avail.componentPartCode,
        logicalOperator: avail.logicalOperatorCode,
        expressions: [],
        references: []
      };

      if (avail.availabilityExpressionModels) {
        avail.availabilityExpressionModels.forEach(expr => {
          availData.expressions.push({
            id: expr.uniqueId,
            operator: expr.operatorTypeCode,
            attribute: expr.policyAttribute,
            targetEntity: expr.targetEntity
          });

          if (expr.policyAttribute) {
            availData.references.push(expr.policyAttribute);
            const attr = attributes.find(a => a.reference === expr.policyAttribute);
            if (attr) {
              attr.usedIn.availabilities.push(avail.uniqueId);
            }
          }
        });
      }

      availabilities.push(availData);
      statistics.totalAvailabilities++;
    });
  }

  // Parse Layouts
  if (dto.layoutSets) {
    dto.layoutSets.forEach(layout => {
      layouts.push({
        id: layout.uniqueId,
        name: layout.name,
        reference: layout.reference,
        type: 'layout',
        revisionNumber: layout.revisionNumber,
        channels: dto.channelLayouts?.filter(cl => cl.layout === layout.reference).map(cl => cl.channel) || []
      });
    });
  }

  // Calculate high-impact attributes
  statistics.highImpactAttributes = attributes
    .filter(attr => {
      const totalUsage = attr.usedIn.rules.length + attr.usedIn.calculations.length + attr.usedIn.availabilities.length;
      return totalUsage >= 2;
    })
    .map(attr => ({
      id: attr.id,
      name: attr.name,
      usageCount: attr.usedIn.rules.length + attr.usedIn.calculations.length + attr.usedIn.availabilities.length
    }))
    .sort((a, b) => b.usageCount - a.usageCount);

  return {
    subProduct: {
      uniqueId: dto.uniqueId,
      name: dto.name,
      dictionaryKey: dto.dictionaryKey,
      statusCode: dto.statusCode,
      typeCode: dto.typeCode
    },
    attributes,
    rules,
    availabilities,
    calculations,
    entities,
    layouts,
    statistics
  };
};

/**
 * Extract attribute references from script strings
 */
const extractAttributeReferences = (scriptRef, attributes) => {
  if (!scriptRef) return [];
  
  const references = new Set();
  
  // Extract from script reference path
  // e.g., "multiline.data.cyberInsuranceSubproduct.policyDefaultsV600.script"
  const parts = scriptRef.split('.');
  
  // Look for common attribute patterns in the path
  attributes.forEach(attr => {
    if (scriptRef.includes(attr.dictionaryKey) || scriptRef.includes(attr.reference)) {
      references.add(attr.reference);
    }
  });

  return Array.from(references);
};

/**
 * Determine impact level based on execution level
 */
const determineImpactLevel = (executionLevel) => {
  const levels = {
    'UNDERWRITING': 'high',
    'RATING': 'high',
    'BINDING': 'medium',
    'DEFAULT': 'low'
  };
  return levels[executionLevel] || 'medium';
};