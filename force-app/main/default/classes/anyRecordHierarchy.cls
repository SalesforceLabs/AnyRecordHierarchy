public with sharing class anyRecordHierarchy {
    
    public class CustomExceptionData {
        public String name;
        public String message;
        public Integer code;
        
        public CustomExceptionData(String name, String message, Integer code) {
            this.name = name;
            this.message = message;
            this.code = code;
        }
    }
    
  public static boolean isAccessible(
    List<String> fieldNames,
    DescribeSObjectResult configObject,
    Map<String, Schema.SObjectField> configObjectFields
  ) {
    boolean isSafe = false;
    if (configObject.isAccessible()) {
      for (String fldName : fieldNames) {
        if (!String.isBlank(fldName)) {
          SObjectField myField = configObjectFields.get(fldName);
          if (myField.getDescribe().isAccessible()) {
            isSafe = true;
          } else {
            isSafe = false;
            break;
          }
        }
      }
    } else {
      isSafe = false;
    }
    return isSafe;
  }
    
    public static boolean isDeletable(
        DescribeSObjectResult configObject
    ) {
        boolean isSafe = false;
        if (configObject.isDeletable()) {
            isSafe = true;
        }
        return isSafe;
    }
    
    public static boolean isAccessibleFLS(List<String> fieldNames, String objName){
        boolean isSafe = false;
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        DescribeSObjectResult myObj = schemaMap.get(objName).getDescribe();
        if(myObj.isAccessible()){ 
            Map<String, Schema.SObjectField> myObjFields = myObj.fields.getMap();
            for(String fldName: fieldNames){
                SObjectField myField = myObjFields.get(fldName);
                if(myField != null && myField.getDescribe().isAccessible()){
                    isSafe = true;
                }else{
                    isSafe = false;
                    break;
                }    
            }
        }else{
            isSafe = false;
        }
        return isSafe;
    }
    
    public static boolean isUpdateable(List<String> fieldNames, String objName){
        boolean isSafe = false;
        Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
        DescribeSObjectResult myObj = schemaMap.get(objName).getDescribe();
        if(myObj.isUpdateable()){ 
            Map<String, Schema.SObjectField> myObjFields = myObj.fields.getMap();
            for(String fldName: fieldNames){
                SObjectField myField = myObjFields.get(fldName);
                if(myField != null && myField.getDescribe().isUpdateable()){
                    isSafe = true;
                }else{
                    isSafe = false;
                    break;
                }    
            }
        }else{
            isSafe = false;
        }
        return isSafe;
    }

  public static boolean isCreatable(
    List<String> fieldNames,
    DescribeSObjectResult configObject,
    Map<String, Schema.SObjectField> configObjectFields
  ) {
    boolean isSafe = false;
    if (configObject.isCreateable()) {
      for (String fldName : fieldNames) {
        if (!String.isBlank(fldName)) {
          SObjectField myField = configObjectFields.get(fldName);
          if (myField.getDescribe().isCreateable()) {
            isSafe = true;
          } else {
            isSafe = false;
            break;
          }
        }
      }
    } else {
      isSafe = false;
    }
    return isSafe;
  }

  public static String getNameField(DescribeSObjectResult dsores) {
    String fName = 'No Name Field';
    if (dsores.isAccessible()) {
      Map<String, SObjectField> fields = dsores.fields.getMap();
      for (sObjectField s : fields.values()) {
        Schema.DescribeFieldResult t = s.getDescribe();
        if (t.isNameField()) {
          if (t.isAccessible()) {
            fName = t.getName();
          }
          break;
        }
      }
    }
    return fName;
  }

  @AuraEnabled(cacheable=true)
  public static String getConfig(Id configId) {
    try {
        ARH__Configuration__c configRec;
        string fieldNames = 'Name,ARH__Detail_Field_1__c,ARH__Detail_Field_2__c,ARH__Detail_Field_3__c,ARH__Detail_Field_4__c,ARH__Detail_Field_5__c,ARH__Object__c,ARH__Relationship_Field__c,ARH__Visual_Field__c,ARH__Visual_Type__c,ARH__Search_Field__c';
        if(isAccessibleFLS(fieldNames.split(','),'ARH__Configuration__c')){
            system.debug('in query for configuration');
           configRec = [
                SELECT
                Id,
                Name,
                ARH__Detail_Field_1__c,
                ARH__Detail_Field_2__c,
                ARH__Detail_Field_3__c,
                ARH__Detail_Field_4__c,
                ARH__Detail_Field_5__c,
                ARH__Object__c,
                ARH__Relationship_Field__c,
                ARH__Visual_Field__c,
                ARH__Visual_Type__c,
                ARH__Search_Field__c
                FROM ARH__Configuration__c
                WHERE Id = :configId
            ];
        }else{
            system.debug('in exception');
            String message = 'You do not have access to the Hierarchy Configuration object. Please contact your administrator to make sure you have access to the Hierarchy Configuration object or have the \'Any Record Hierarchy\' permission set assigned.';
            AuraHandledException e = new AuraHandledException(message);
            e.setMessage(message);
            throw e;
        }
      

      //Fields To Describe
      Map<String, String> fieldsToDescribe = new Map<String, String>();
      fieldsToDescribe.put(
        'ARH__Detail_Field_1__c',
        configRec.ARH__Detail_Field_1__c
      );
      fieldsToDescribe.put(
        'ARH__Detail_Field_2__c',
        configRec.ARH__Detail_Field_2__c
      );
      fieldsToDescribe.put(
        'ARH__Detail_Field_3__c',
        configRec.ARH__Detail_Field_3__c
      );
      fieldsToDescribe.put(
        'ARH__Detail_Field_4__c',
        configRec.ARH__Detail_Field_4__c
      );
      fieldsToDescribe.put(
        'ARH__Detail_Field_5__c',
        configRec.ARH__Detail_Field_5__c
      );
      fieldsToDescribe.put(
        'ARH__Visual_Field__c',
        configRec.ARH__Visual_Field__c
      );

      //Error Message
      String errorMessage = 'You do not have access to either the Fields or the Object. Please contact your administrator.';

      //Prep for SOQL Query
      String queryString = 'Select ';
      Set<String> fieldsToQuery = new Set<String>();

      Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();

      //Get Config Object Describe
      DescribeSObjectResult configObject = globalDescribe.get(
          configRec.ARH__Object__c
        )
        .getDescribe();

      //Get Object Fiels
      Map<String, Schema.SObjectField> configObjectFields = configObject.fields.getMap();

      //Check for Object and Field Access
      List<String> fieldNamesToCheckAccess = fieldsToDescribe.values();
      fieldNamesToCheckAccess.add(configRec.ARH__Search_Field__c);
      fieldNamesToCheckAccess.add(configRec.ARH__Relationship_Field__c);

      if (
        !isAccessible(fieldNamesToCheckAccess, configObject, configObjectFields)
      ) {
          CustomExceptionData cExpData = new CustomExceptionData('Insufficient Privileges', 'You do not have access to either the Fields or the Object. Please contact your administrator.', 403);
          //throw new AuraHandledException(JSON.serialize(data));
          AuraHandledException e = new AuraHandledException(JSON.serialize(cExpData));
          e.setMessage(JSON.serialize(cExpData));
          throw e;
      }

      Schema.DescribeFieldResult relationField = configObjectFields.get(
          configRec.ARH__Relationship_Field__c
        )
        .getDescribe();
      fieldsToQuery.add(configRec.ARH__Relationship_Field__c);

      //Prep Configuration Metadata
      Map<String, Schema.DescribeFieldResult> objectFields = new Map<String, Schema.DescribeFieldResult>();

      //Store Relationfield Object's Name Field
      Map<String, String> refObjNameFields = new Map<String, String>();

      for (string fld : fieldsToDescribe.keySet()) {
        String fieldAPIName = fieldsToDescribe.get(fld);
        if (!String.isBlank(fieldAPIName)) {
          Schema.DescribeFieldResult dfr = configObjectFields.get(fieldAPIName)
            .getDescribe();
          objectFields.put(fld, dfr);
          fieldsToQuery.add(dfr.getName());
          if (String.valueOf(dfr.getType()) == 'Reference') {
            String relObjfieldName;
            if (dfr.isNamePointing()) {
              relObjfieldName = 'Name';
            } else {
              relObjfieldName = getNameField(
                dfr.getReferenceTo()[0].getDescribe()
              );
            }
            if (relObjfieldName == 'No Name Field') {
                CustomExceptionData cExpData = new CustomExceptionData('Insufficient Privileges', 'You do not have access to either the Fields or the Object. Please contact your administrator.', 403);
                //throw new AuraHandledException(JSON.serialize(data));
                AuraHandledException e = new AuraHandledException(JSON.serialize(cExpData));
                e.setMessage(JSON.serialize(cExpData));
                throw e;
            }
            fieldsToQuery.add(
              dfr.getRelationshipName() +
              '.' +
              relObjfieldName
            );
            refObjNameFields.put(dfr.getRelationshipName(), relObjfieldName);
          }
        }
      }

      //system.debug('objectFields ' + objectFields);

      if (!fieldsToQuery.contains('Id')) {
        fieldsToQuery.add('Id');
      }

      queryString +=
        String.join((Iterable<String>) fieldsToQuery, ', ').removeEnd(', ') +
        ' from ' +
        configRec.ARH__Object__c;

      //system.debug('queryString ' + queryString);

      Map<String, String> cData = new Map<String, String>();
      cData.put('metadata', JSON.serialize(objectFields));
      cData.put('refObjNameFields', JSON.serialize(refObjNameFields));
      cData.put('queryString', queryString);
      cData.put('visualType', configRec.ARH__Visual_Type__c);
      cData.put('relationField', configRec.ARH__Relationship_Field__c);
      cData.put('searchField', configRec.ARH__Search_Field__c);

      return JSON.serialize(cData);
    } catch (exception e) {
        String exceptionMessage;
        String exceptionType = e.getTypeName();
        if(exceptionType == 'System.AuraHandledException'){
            exceptionMessage = e.getMessage();
        }else if(exceptionType == 'System.QueryException' && e.getMessage() == 'List has no rows for assignment to SObject'){
            CustomExceptionData data = new CustomExceptionData('Uh Oh! Hierarchy Configuration not found.', 'We couldn\'t find selected Hierarchy Configuration. Please contact your administrator.', 404);
            exceptionMessage = JSON.serialize(data);
        }else{
            CustomExceptionData data = new CustomExceptionData('Uh Oh! An Error Occurred.', e.getMessage(), 400);
            exceptionMessage = JSON.serialize(data);
        }
        
        AuraHandledException aexp = new AuraHandledException(exceptionMessage);
        aexp.setMessage(exceptionMessage);
        throw aexp;
    }
  }

  @AuraEnabled(cacheable=true)
  public static String getRecords(
    String queryString,
    String relationField,
    Id currentRecId
  ) {
    queryString = String.escapeSingleQuotes(queryString);
    relationField = String.escapeSingleQuotes(relationField);
    try {
      if (
        String.isBlank(queryString) ||
        String.isBlank(relationField) ||
        currentRecId == null
      ) {
        AuraHandledException e = new AuraHandledException('Invalid Parameters');
        e.setMessage('Invalid Parameters');
        throw e;
      }

      Map<String, sObject[]> recData = new Map<String, sObject[]>();

      String currentRecordQuery =
        queryString +
        ' where Id = \'' +
        currentRecId +
        '\'';
      sObject[] currentRecord = Security.stripInaccessible(AccessType.READABLE, Database.query(currentRecordQuery)).getRecords();
      recData.put('currentRecord', currentRecord);

      Id currentParentRecordId = (Id)currentRecord[0].get(relationField);
      if (currentParentRecordId != null) {
        recData.put(
          'parentRecords',
          getSObjectHierarchy(
            queryString,
            relationField,
            String.ValueOf(currentParentRecordId),
            new List<sObject>()
          )
        );
      }

      String childQuery =
        queryString +
        ' where ' +
        relationField +
        ' = \'' +
        currentRecId +
        '\'';
      recData.put('childRecords', Security.stripInaccessible(AccessType.READABLE, Database.query(childQuery)).getRecords());

      //system.debug(recData);

      return JSON.serialize(recData);
    } catch (exception e) {
      AuraHandledException excp = new AuraHandledException(e.getMessage());
      excp.setMessage(e.getMessage());
      throw excp;
    }
  }

  @AuraEnabled
  public static List<sObject> getPeerRecords(String queryString, String relationField, Id parentRecordId, Id currentRecId){
    try {
      if(String.isEmpty(parentRecordId)) {
        return new List<sObject>();
      }
      String peerQuery = queryString 
        + ' where ' + relationField + ' = \'' + parentRecordId 
        +'\' AND Id != \'' + currentRecId + '\'';
        system.debug(peerQuery);
        return Security.stripInaccessible(AccessType.READABLE, Database.query(peerQuery)).getRecords();
    } catch (exception e) {
      AuraHandledException excp = new AuraHandledException(e.getMessage());
      excp.setMessage(e.getMessage());
      throw excp;
    }
  }

  @AuraEnabled
  public static List<sObject> getSObjectHierarchy(
    String queryString,
    String relationField,
    String recordId,
    List<sObject> recordList
  ) {
    try {
      queryString = String.escapeSingleQuotes(queryString);
      recordId = String.escapeSingleQuotes(recordId);
      relationField = String.escapeSingleQuotes(relationField);
      //system.debug(recordList);
      if (recordList == null) {
        recordList = new List<sObject>();
      }
      String recQueryStr = queryString + ' where Id = \'' + recordId + '\'';
      sObject rec = Security.stripInaccessible(AccessType.READABLE, Database.query(recQueryStr)).getRecords()[0];
      recordList.add(rec);
      if (rec.get(relationField) != null) {
        if (
          Limits.getQueries() <= Limits.getLimitQueries() &&
          recordList.size() <= 3
        )
          getSObjectHierarchy(
            queryString,
            relationField,
            String.ValueOf(rec.get(relationField)),
            recordList
          );
      }
      return recordList;
    } catch (exception e) {
      AuraHandledException excp = new AuraHandledException(e.getMessage());
      excp.setMessage(e.getMessage());
      throw excp;
    }
  }

  @AuraEnabled(cacheable=true)
  public static Object searchRecords(
    String searchKey,
    String searchObj,
    String displayField,
    String searchMode,
    String parentRecordId,
    String relationField
  ) {
    searchKey = String.escapeSingleQuotes(searchKey);
    searchObj = String.escapeSingleQuotes(searchObj);
    displayField = String.escapeSingleQuotes(displayField);
    try {
      if (
        !String.isBlank(searchKey) &&
        !String.isBlank(searchObj) &&
        !String.isBlank(displayField)
      ) {
        String key = '%' + searchKey + '%';
        String soqlStr = 'select Id, ' + displayField + ' from ' + searchObj;
        soqlStr += ' WHERE ' + displayField + ' LIKE \'' + key + '\'';
        if(searchMode == 'child'){
          soqlStr += ' AND ' + relationField + ' = \'' + parentRecordId + '\'';
        }
        soqlStr +=
          ' WITH SECURITY_ENFORCED ORDER BY ' +
          displayField +
          ' DESC LIMIT 8';
        List<sObject> sObjResults = Database.query(soqlStr);
        return sObjResults;
      } else {
        return new List<sObject>();
      }
    } catch (exception e) {
      AuraHandledException excp = new AuraHandledException(e.getMessage());
      excp.setMessage(e.getMessage());
      throw excp;
    }
  }
}