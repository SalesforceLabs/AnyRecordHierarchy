@isTest
public class anyRecordHierarchy_Test {
  private static User sysAdminUser() {
    Profile p = [
      SELECT Id, Name
      FROM Profile
      WHERE Name = 'System Administrator'
    ];

    PermissionSet ps = [
      SELECT Id
      FROM PermissionSet
      WHERE Name = 'Any_Record_Hierarchy'
    ];

    User u = new User(
      UserName = 'test-user@arh1233123.com',
      FirstName = 'Test-First-Name',
      LastName = 'Test-Last-Name',
      Alias = 'test',
      Email = 'test-user@test-company.com',
      EmailEncodingKey = 'UTF-8',
      LanguageLocaleKey = 'en_US',
      LocalesIdKey = 'en_US',
      TimezonesIdKey = 'America/Los_Angeles',
      ProfileId = p.Id
    );
    insert u;

    insert new PermissionSetAssignment(
      AssigneeId = u.id,
      PermissionSetId = ps.Id
    );

    return u;
  }

  public static testMethod void configurationsPicklist_s1() {
    VisualEditor.DesignTimePageContext vdc = new VisualEditor.DesignTimePageContext();
    vdc.entityName = 'Account';
    vdc.pageType = 'RecordPage';

    configurationsPicklist configRecs = new configurationsPicklist(vdc);
    VisualEditor.DataRow defaultRow = configRecs.getDefaultValue();
    VisualEditor.DynamicPickListRows pickVals = configRecs.getValues();

    System.assertEquals('None Available for the Object', defaultRow.getLabel());
  }

  public static testMethod void configurationsPicklist_s2() {
    System.runAs(sysAdminUser()) {
      sobject configRec = (SObject) Type.forName('ARH__Configuration__c')
        .newInstance();
      configRec.put('Name', 'Account and Parent Account');
      configRec.put('ARH__Object__c', 'Account');
      configRec.put('ARH__Detail_Field_1__c', 'Name');
      configRec.put('ARH__Detail_Field_2__c', 'AccountNumber');
      configRec.put('ARH__Detail_Field_3__c', 'AnnualRevenue');
      configRec.put('ARH__Detail_Field_4__c', 'Website');
      configRec.put('ARH__Detail_Field_5__c', 'CreatedById');
      configRec.put('ARH__Relationship_Field__c', 'ParentId');
      configRec.put('ARH__Visual_Field__c', 'Name');
      configRec.put('ARH__Visual_Type__c', 'Abbreviation');
      insert configRec;

      VisualEditor.DesignTimePageContext vdc = new VisualEditor.DesignTimePageContext();
      vdc.entityName = 'Account';
      vdc.pageType = 'RecordPage';

      configurationsPicklist configRecs = new configurationsPicklist(vdc);
      VisualEditor.DataRow defaultRow = configRecs.getDefaultValue();
      VisualEditor.DynamicPickListRows pickVals = configRecs.getValues();

      System.assertEquals('Account and Parent Account', defaultRow.getLabel());
    }
  }

  public static testMethod void anyRecordHierarchy_getConfigAndGetRecords() {
    System.runAs(sysAdminUser()) {
      //Create Account Records
      sobject accRec1 = (SObject) Type.forName('Account').newInstance();
      accRec1.put('Name', 'Parent Account');
      insert accRec1;

      sobject accRec2 = (SObject) Type.forName('Account').newInstance();
      accRec2.put('Name', 'Child Account');
      accRec2.put('ParentId', accRec1.get('Id'));
      insert accRec2;

      sobject accRec3 = (SObject) Type.forName('Account').newInstance();
      accRec3.put('Name', 'Grandchild Account');
      accRec3.put('ParentId', accRec2.get('Id'));
      insert accRec3;

      //Create Configuration Record
      sobject configRec = (SObject) Type.forName('ARH__Configuration__c')
        .newInstance();
      configRec.put('Name', 'Account and Parent Account');
      configRec.put('ARH__Object__c', 'Account');
      configRec.put('ARH__Detail_Field_1__c', 'Name');
      configRec.put('ARH__Detail_Field_2__c', 'AccountNumber');
      configRec.put('ARH__Detail_Field_3__c', 'AnnualRevenue');
      configRec.put('ARH__Detail_Field_4__c', 'Website');
      configRec.put('ARH__Detail_Field_5__c', 'CreatedById');
      configRec.put('ARH__Relationship_Field__c', 'ParentId');
      configRec.put('ARH__Visual_Field__c', 'Name');
      configRec.put('ARH__Visual_Type__c', 'Abbreviation');
      configRec.put('ARH__Search_Field__c', 'Name');
      insert configRec;

      //Get Config Metadata, QueryString, RelationField, visualType
      String configData = anyRecordHierarchy.getConfig(configRec.Id);

      //Get Records According to Configuration
      Map<String, String> configDataMap = (Map<String, String>) JSON.deserialize(
        configData,
        Map<String, String>.class
      );

      //Positive Test getRecords()
      Test.startTest();
      anyRecordHierarchy.getRecords(
        (String) configDataMap.get('queryString'),
        (String) configDataMap.get('relationField'),
        (Id) accRec2.get('Id')
      );
      Test.stopTest();

      //Negative Test getRecords()
      try {
        anyRecordHierarchy.getRecords('Test', 'Test', null);
      } catch (System.AuraHandledException e) {
        system.assertEquals('System.AuraHandledException', e.getTypeName());
      }

      //Positive Test searchRecords()
      anyRecordHierarchy.searchRecords(
        'Acc',
        (String) configRec.get('ARH__Object__c'),
        (String) configDataMap.get('searchField'),
        null,
        null,
        null
      );
      anyRecordHierarchy.searchRecords(
        '123',
        (String) configRec.get('ARH__Object__c'),
        (String) configDataMap.get('searchField'),
        null,
        null,
        null
      );

      //Negative Test searchRecords()
      try {
        anyRecordHierarchy.searchRecords('Acc', 'Test', 'Contact', null,
        null,
        null);
      } catch (System.AuraHandledException e) {
        system.assertEquals('System.AuraHandledException', e.getTypeName());
      }

      //Negative Test getSObjectHierarchy()
      try {
        List<sObject> getSObjectHierarchy = anyRecordHierarchy.getSObjectHierarchy(
          'Test',
          'Test',
          'Test',
          null
        );
      } catch (System.AuraHandledException e) {
        system.assertEquals('System.AuraHandledException', e.getTypeName());
      }

      //Negative Test getConfig()
      try {
        String configData2 = anyRecordHierarchy.getConfig(null);
      } catch (System.AuraHandledException e) {
        system.assertEquals('System.AuraHandledException', e.getTypeName());
      }

      System.assertEquals(
        'ParentId',
        (String) configDataMap.get('relationField')
      );
    }

  }

  @isTest
  static void testInstallScript() {
    System.runAs(sysAdminUser()) {
      ARHPostInstall postinstall = new ARHPostInstall();
      Test.testInstall(postinstall, null);
      Test.testInstall(postinstall, new Version(1, 0), true);
      List<ARH__Configuration__c> a = [
        SELECT id, Name
        FROM ARH__Configuration__c
      ];
      System.assertEquals(a.size(), 4);
    }
  }

  public static testMethod void AnyRecordControllerClass() {
    //Create Configuration Record
    System.runAs(sysAdminUser()) {
      sobject configRec = (SObject) Type.forName('ARH__Configuration__c')
        .newInstance();
      configRec.put('Name', 'Account and Parent Account');
      configRec.put('ARH__Object__c', 'Account');
      configRec.put('ARH__Detail_Field_1__c', 'Name');
      configRec.put('ARH__Detail_Field_2__c', 'AccountNumber');
      configRec.put('ARH__Detail_Field_3__c', 'AnnualRevenue');
      configRec.put('ARH__Detail_Field_4__c', 'Website');
      configRec.put('ARH__Detail_Field_5__c', 'CreatedById');
      configRec.put('ARH__Relationship_Field__c', 'ParentId');
      configRec.put('ARH__Visual_Field__c', 'Name');
      configRec.put('ARH__Visual_Type__c', 'Abbreviation');
      insert configRec;

      AnyRecordControllerClass.getObjects();
      AnyRecordControllerClass.getRefFields('Account');
      AnyRecordControllerClass.getNonRefFields('Account');
      AnyRecordControllerClass.getAllConfigRecords();

      Boolean updateRecordResult = AnyRecordControllerClass.updateRecord(
        (ARH__Configuration__c) configRec
      );
      Boolean deleteRecordResult = AnyRecordControllerClass.deleteRecord(
        (ARH__Configuration__c) configRec
      );

      System.assertEquals(true, updateRecordResult);
      System.assertEquals(true, deleteRecordResult);
    }
  }
}
