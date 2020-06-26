global with sharing class configurationsPicklist extends VisualEditor.DynamicPickList {
  public List<ARH__Configuration__c> allConfigs;
  VisualEditor.DesignTimePageContext context;
  String naMessage = 'None Available';

  global configurationsPicklist(VisualEditor.DesignTimePageContext context) {
    string queryStr = 'Select Id, Name from ARH__Configuration__c';
    if (context.pageType == 'RecordPage') {
      queryStr += ' where ARH__Object__c = \'' + context.entityName + '\'';
      naMessage += ' for the Object';
    }
    this.allConfigs = Database.query(queryStr);
    this.context = context;
  }

  global override VisualEditor.DataRow getDefaultValue() {
    VisualEditor.DataRow defaultValue;
    if (allConfigs.size() > 0) {
      defaultValue = new VisualEditor.DataRow(
        (string) allConfigs[0].get('Name'),
        (string) allConfigs[0].get('Id')
      );
    } else {
      defaultValue = new VisualEditor.DataRow(naMessage, 'None');
    }
    return defaultValue;
  }

  global override VisualEditor.DynamicPickListRows getValues() {
    VisualEditor.DynamicPickListRows myValues = new VisualEditor.DynamicPickListRows();
    if (allConfigs.size() > 0) {
      for (ARH__Configuration__c config : allConfigs) {
        myValues.addRow(
          new VisualEditor.DataRow(
            string.valueOf(config.Name),
            string.valueOf(config.Id)
          )
        );
      }
    } else {
      myValues.addRow(new VisualEditor.DataRow(naMessage, 'None'));
    }
    return myValues;
  }
}