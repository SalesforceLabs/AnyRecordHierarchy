public with sharing class AnyRecordControllerClass {
  @AuraEnabled
  public static Map<String, String> getObjects() {
    Map<String, String> objNames = new Map<String, String>();

    for (Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()) {
      objNames.put(
        objTyp.getDescribe().getLabel(),
        objTyp.getDescribe().getName()
      );
    }

    return objNames;
  }

  @AuraEnabled
  public static Map<String, String> getRefFields(String objName) {
    Map<String, String> fieldNames = new Map<String, String>();

    DescribeSObjectResult leadDesc = Schema.getGlobalDescribe()
      .get(objName)
      .getDescribe();
    Map<String, Schema.SObjectField> leadFields = leadDesc.fields.getMap();
    for (Schema.SObjectField fld : leadFields.values()) {
      if (string.valueOf(fld.getDescribe().getType()) == 'REFERENCE') {
        sObjectField lookupField = leadFields.get(
          string.valueOf(fld.getDescribe().Name)
        );
        if (String.valueOf(lookupField) != 'MasterRecordId') {
          DescribeFieldResult lfDesc = lookupField.getDescribe();
          List<SObjectType> refObjs = lfDesc.getReferenceTo();
          for (SObjectType so : refObjs) {
            if (String.valueOf(so) == objName)
              fieldNames.put(
                string.valueOf(fld.getDescribe().Name),
                string.valueOf(fld.getDescribe().Label)
              );
          }
        }
      }
    }
    return fieldNames;
  }

  @AuraEnabled
  public static Map<String, Map<String, String>> getNonRefFields(
    String objName
  ) {
    Map<String, Map<String, String>> allnonfields = new Map<String, Map<String, String>>();
    Map<String, String> fieldNames = new Map<String, String>();
    Map<String, String> fieldSearch = new Map<String, String>();
    Map<String, String> fieldVT = new Map<String, String>();
    Map<string, Map<String, Schema.SObjectField>> objectFieldsMap = new Map<string, Map<String, Schema.SObjectField>>();
    Map<String, Schema.SObjectField> objectFields = Schema.getGlobalDescribe()
      .get(objName)
      .getDescribe()
      .fields.getMap();
    for (Schema.SObjectField fld : objectFields.values()) {
      schema.describeFieldResult dfield = fld.getDescribe();
      String fldType = string.valueOf(dfield.getType());

      if (fldType != 'TEXTAREA' && fldType != 'ENCRYPTEDSTRING') {
        fieldNames.put(
          string.valueOf(fld.getDescribe().Name),
          string.valueOf(fld.getDescribe().Label)
        );
        if (fldType == 'STRING') {
          fieldSearch.put(
            string.valueOf(fld.getDescribe().Name),
            string.valueOf(fld.getDescribe().Label)
          );
          fieldVT.put(
            string.valueOf(fld.getDescribe().Name),
            string.valueOf(fld.getDescribe().Label)
          );
        }
        if (fldType == 'URL') {
          fieldVT.put(
            string.valueOf(fld.getDescribe().Name),
            string.valueOf(fld.getDescribe().Label)
          );
        }
      }
    }
    allnonfields.put('AllFields', fieldNames);
    allnonfields.put('search', fieldSearch);
    allnonfields.put('vt', fieldVT);
    return allnonfields;
  }

  @AuraEnabled
  public static List<SObject> getAllConfigRecords() {
    List<Configuration__c> lstConfigurable = new List<Configuration__c>();
    string fields = 'ARH__Name,ARH__Object__c,ARH__Relationship_Field__c,ARH__Detail_Field_1__c,ARH__Detail_Field_2__c,ARH__Detail_Field_3__c,ARH__Detail_Field_4__c,ARH__Detail_Field_5__c,ARH__Visual_Type__c,ARH__Visual_Field__c,ARH__Search_Field__c';
    List<string> lstFieldNames = new List<string>();
    lstFieldNames.addAll(fields.split(','));
    SYSTEM.DEBUG('ENETRED');
    if (
      anyRecordHierarchy.isAccessibleFLS(lstFieldNames, 'ARH__Configuration__c')
    ) {
      SYSTEM.DEBUG('STARTED');
      lstConfigurable = [
        SELECT
          Id,
          Name,
          Object__c,
          Relationship_Field__c,
          Detail_Field_1__c,
          Detail_Field_2__c,
          Detail_Field_3__c,
          Detail_Field_4__c,
          Detail_Field_5__c,
          Visual_Type__c,
          Visual_Field__c,
          Search_Field__c
        FROM Configuration__c
        ORDER BY createddate DESC
        LIMIT 1000
      ];
    }
    return lstConfigurable;
  }

  @AuraEnabled
  public static boolean updateRecord(Configuration__c recordForUpdate) {
    //System.debug('recordForUpdate');
    //System.debug(recordForUpdate);
    boolean isSuccess = false;
    List<string> lstFieldNames = new List<string>();
    string fields = 'ARH__Name,ARH__Object__c,ARH__Relationship_Field__c,ARH__Detail_Field_1__c,ARH__Detail_Field_2__c,ARH__Detail_Field_3__c,ARH__Detail_Field_4__c,ARH__Detail_Field_5__c,ARH__Visual_Type__c,ARH__Visual_Field__c,ARH__Search_Field__c';
    lstFieldNames.addAll(fields.split(','));
    if (
      anyRecordHierarchy.isUpdateable(lstFieldNames, 'ARH__Configuration__c')
    ) {
      List<Configuration__c> cnLst = new List<Configuration__c>{
        recordForUpdate
      };
      try {
        if (cnLst.size() > 0) {
          upsert recordForUpdate;
          isSuccess = true;
        }
      } catch (Exception e) {
        //System.debug(e);
        isSuccess = false;
      }
    }
    return isSuccess;
  }

  @AuraEnabled
  public static boolean deleteRecord(Configuration__c recordToDelete) {
    //System.debug('recordForDelete');
    //System.debug(recordToDelete);

    Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
    DescribeSObjectResult configObject = globalDescribe.get(
        'ARH__Configuration__c'
      )
      .getDescribe();
    boolean isSuccess = false;
    if (anyRecordHierarchy.isDeletable(configObject)) {
      List<Configuration__c> cnLst = new List<Configuration__c>{
        recordToDelete
      };
      try {
        if (cnLst.size() > 0) {
          delete recordToDelete;
          isSuccess = true;
        }
      } catch (Exception e) {
        //System.debug(e);
        isSuccess = false;
      }
    }
    return isSuccess;
  }
}
