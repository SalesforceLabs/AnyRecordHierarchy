global class ARHPostInstall implements InstallHandler {
  global void onInstall(InstallContext context) {
    if (context.previousVersion() == null) {
      Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();

      //Get Config Object Describe
      DescribeSObjectResult configObject = globalDescribe.get(
          'ARH__Configuration__c'
        )
        .getDescribe();

      //Get Object Fiels
      Map<String, Schema.SObjectField> configObjectFields = configObject.fields.getMap();
      //Check for Object and Field Access
      List<String> fieldNamesToCheckAccess = new List<String>();
      fieldNamesToCheckAccess.add('Name');
      fieldNamesToCheckAccess.add('ARH__Object__c');
      fieldNamesToCheckAccess.add('ARH__Relationship_Field__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_1__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_2__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_3__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_4__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_5__c');
      fieldNamesToCheckAccess.add('ARH__Detail_Field_5__c');
      fieldNamesToCheckAccess.add('ARH__Visual_Type__c');
      fieldNamesToCheckAccess.add('ARH__Visual_Field__c');
      fieldNamesToCheckAccess.add('ARH__Search_Field__c');

      if (
        anyRecordHierarchy.isCreatable(
          fieldNamesToCheckAccess,
          configObject,
          configObjectFields
        )
      ) {
        ARH__Configuration__c arhObj1 = new ARH__Configuration__c();
        arhObj1.Name = 'ARH User Config';
        arhObj1.ARH__Object__c = 'User';
        arhObj1.ARH__Relationship_Field__c = 'ManagerId';
        arhObj1.ARH__Detail_Field_1__c = 'Name';
        arhObj1.ARH__Detail_Field_2__c = 'Title';
        arhObj1.ARH__Detail_Field_3__c = 'MobilePhone';
        arhObj1.ARH__Detail_Field_4__c = 'CompanyName';
        arhObj1.ARH__Detail_Field_5__c = 'SenderEmail';
        arhObj1.ARH__Visual_Type__c = 'Image';
        arhObj1.ARH__Visual_Field__c = 'MediumPhotoUrl';
        arhObj1.ARH__Search_Field__c = 'Name';
        insert arhObj1;

        ARH__Configuration__c arhObj2 = new ARH__Configuration__c();
        arhObj2.Name = 'ARH Asset Config';
        arhObj2.ARH__Object__c = 'Asset';
        arhObj2.ARH__Relationship_Field__c = 'ParentId';
        arhObj2.ARH__Detail_Field_1__c = 'Name';
        arhObj2.ARH__Detail_Field_2__c = 'SerialNumber';
        arhObj2.ARH__Detail_Field_3__c = 'Status';
        arhObj2.ARH__Detail_Field_4__c = 'UsageEndDate';
        arhObj2.ARH__Detail_Field_5__c = 'Quantity';
        arhObj2.ARH__Visual_Type__c = 'Abbreviation';
        arhObj2.ARH__Visual_Field__c = 'Name';
        arhObj2.ARH__Search_Field__c = 'Name';
        insert arhObj2;

        ARH__Configuration__c arhObj3 = new ARH__Configuration__c();
        arhObj3.Name = 'ARH Case Config';
        arhObj3.ARH__Object__c = 'Case';
        arhObj3.ARH__Relationship_Field__c = 'ParentId';
        arhObj3.ARH__Detail_Field_1__c = 'CaseNumber';
        arhObj3.ARH__Detail_Field_2__c = 'Subject';
        arhObj3.ARH__Detail_Field_3__c = 'Status';
        arhObj3.ARH__Detail_Field_4__c = 'Priority';
        arhObj3.ARH__Detail_Field_5__c = 'Origin';
        arhObj3.ARH__Visual_Type__c = 'Abbreviation';
        arhObj3.ARH__Visual_Field__c = 'Subject';
        arhObj3.ARH__Search_Field__c = 'CaseNumber';
        insert arhObj3;

        ARH__Configuration__c arhObj4 = new ARH__Configuration__c();
        arhObj4.Name = 'ARH Account Config';
        arhObj4.ARH__Object__c = 'Account';
        arhObj4.ARH__Relationship_Field__c = 'ParentId';
        arhObj4.ARH__Detail_Field_1__c = 'Name';
        arhObj4.ARH__Detail_Field_2__c = 'AccountNumber';
        arhObj4.ARH__Detail_Field_3__c = 'Type';
        arhObj4.ARH__Detail_Field_4__c = 'Phone';
        arhObj4.ARH__Detail_Field_5__c = 'Website';
        arhObj4.ARH__Visual_Type__c = 'Abbreviation';
        arhObj4.ARH__Visual_Field__c = 'Name';
        arhObj4.ARH__Search_Field__c = 'Name';
        insert arhObj4;

        User u = [SELECT Id, Email FROM User WHERE Id = :context.installerID()];
        String toAddress = u.Email;
        String[] toAddresses = new List<String>{ toAddress };
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(toAddresses);
        //mail.setReplyTo('syarlagadda@salesforce.com');
        mail.setSenderDisplayName('ARH Package Support');
        mail.setSubject('Package install successful');
        mail.setPlainTextBody('Thanks for installing the package.');
        Messaging.sendEmail(new List<Messaging.Email>{ mail });
      }
    }
  }
}
