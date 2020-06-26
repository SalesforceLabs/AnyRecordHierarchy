import {
  LightningElement,
  track
} from "lwc";
import {
  ShowToastEvent
} from "lightning/platformShowToastEvent";
import getRecList from "@salesforce/apex/AnyRecordControllerClass.getAllConfigRecords";
import getNRFields from "@salesforce/apex/AnyRecordControllerClass.getNonRefFields";
import getSObjects from "@salesforce/apex/AnyRecordControllerClass.getObjects";
import getRFields from "@salesforce/apex/AnyRecordControllerClass.getRefFields";
import updateSObject from "@salesforce/apex/AnyRecordControllerClass.updateRecord";
import deleteSObject from "@salesforce/apex/AnyRecordControllerClass.deleteRecord";
const TOAST_ERROR_TITLE = "Error occured!";
const ERROR_VARIANT = "error";

export default class AnyRecHAdmin extends LightningElement {
  @track itemsON = [];
  @track itemsRF = [];
  @track itemsDT = [];
  @track itemsSF = [];
  @track itemsVT = [];
  @track myList = [];
  @track currentRecord = {};
  @track loaded = true;
  @track isDisabled = true;
  @track isDisabled1;
  @track isDisabled2;
  @track isDisabled3;
  @track isDisabled4;
  @track isDisabled5;
  @track isDisabled6;
  @track isDisabled7;
  @track isDisabledvt;
  @track isDisabledRF = true;
  @track isDisabledvt;
  @track isDisabledName;
  //All Field values
  @track conName;
  @track myObjectName;
  @track myLookupFld;
  @track value1;
  @track value2;
  @track value3;
  @track value4;
  @track value5;
  @track value6;
  @track value7;
  @track currRecId = {};
  @track areButtonsVisible = false;
  @track showDelete = false;
  @track visType;
  @track enableButtons = true;
  @track illus = true;
  @track tempList = [];

  @track visualType;
  @track currentEditingField;
  @track configName;
  @track searchString;

  /**Modal Properties */

  //track whether the modal is open(true) or closed(false), closed by default
  @track isModalOpen = false;

  //sets the isModalOpen property to true, indicating that the Modal is Open
  showModal() {
    this.isModalOpen = true;
  }

  //sets the isModalOpen property to false, indicating that the Modal is Closed
  closeModal() {
    this.isModalOpen = false;
  }

  /* 
  can be used instead of the above two methods - showModal() & closeModal()
  just toggles the isModalOpen property - true if false, false if true 
  */
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  //compute the CSS classes of the Modal(popup) based on the value of isModalOpen property
  get modalClass() {
    return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" : ""}`;
  }

  //compute the CSS classes of the Modal Backdrop(grey overlay) based on the value of isModalOpen property
  get modalBackdropClass() {
    return `slds-backdrop ${this.isModalOpen ? "slds-backdrop_open" : ""}`;
  }

  /**Modal code end */

  PropertyName = {
    name: "Howdy! Fancy a hierarchy?",
    message: "Click 'New' or select a configuration from the list to get started.",
    code: 200
  };

  get visOption() {
    return [{
        label: "Abbreviation",
        value: "Abbreviation"
      },
      {
        label: "Image",
        value: "Image"
      }
    ];
  }

  handleVisType(event) {
    this.isDisabled6 = false;
    this.visType = event.target.value;
    this.visualType = this.visType;
  }

  updatePrev(event) {
    this.currentEditingField = event.currentTarget.label;
  }
  remFoc(event) {
    this.currentEditingField = "";
  }
  handleChange(event) {
    if (event.currentTarget.label == "Configurations Name") {
      this.conName = event.target.value;
      this.enableSave();
    } else if (event.currentTarget.label == "Object Name") {
      this.myObjectName = event.detail.value;
      this.itemsDT = [];
      this.itemsSF = [];
      this.itemsVT = [];
      this.disableFields();
      this.isDisabled = false;
      this.isDisabledName = false;
      this.resetFields();
      getRFields({
          objName: this.myObjectName
        })
        .then(response => {
          this.isDisabledRF = false;
          this.itemsRF = [];
          this.resetFields();

          if (Object.keys(response).length > 0) {
            for (var key in response) {
              this.itemsRF = [
                ...this.itemsRF,
                {
                  value: key,
                  label: response[key]
                }
              ];
            }
          } else {
            this.isDisabledRF = true;
            const evt = new ShowToastEvent({
              title: "App Supports only Self Relationships",
              message: "There are no Self-Lookup fields available in for the Selected Object.",
              variant: "warning"
            });
            this.dispatchEvent(evt);
          }
          this.enableSave();
        })
        .catch(error => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: TOAST_ERROR_TITLE,
              message: error.message,
              variant: ERROR_VARIANT
            })
          );
        });
    } else if (event.currentTarget.label == "Relationship Field") {
      this.myLookupFld = event.detail.value;
      this.isDisabledvt = false;
      this.currentEditingField = event.detail.value;
      getNRFields({
          objName: this.myObjectName
        })
        .then(response => {
          for (var key in response.AllFields) {
            this.itemsDT = [
              ...this.itemsDT,
              {
                value: key,
                label: response.AllFields[key]
              }
            ];
          }
          for (var key in response.vt) {
            this.itemsVT = [
              ...this.itemsVT,
              {
                value: key,
                label: response.vt[key]
              }
            ];
          }
          for (var key in response.search) {
            this.itemsSF = [
              ...this.itemsSF,
              {
                value: key,
                label: response.search[key]
              }
            ];
          }
          this.enableSave();
        })
        .catch(error => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: TOAST_ERROR_TITLE,
              message: error.message,
              variant: ERROR_VARIANT
            })
          );
        });
    } else if (event.currentTarget.label == "Visual Type") {
      this.isDisabled6 = false;
      this.visType = event.target.value;
      this.visualType = this.visType;
    } else if (event.currentTarget.label == "Image/Abbreviation Field") {
      this.isDisabled7 = false;
      this.value6 = event.detail.value;
      this.enableSave();
    } else if (event.currentTarget.label == "Search Field") {
      this.isDisabled1 = false;
      this.value7 = event.detail.value;
      this.enableSave();
    } else if (event.currentTarget.label == "Detail Field 1") {
      this.isDisabled2 = false;
      this.value1 = event.detail.value;

      this.enableSave();
    } else if (event.currentTarget.label == "Detail Field 2") {
      this.isDisabled3 = false;
      this.value2 = event.detail.value;
      this.enableSave();
    } else if (event.currentTarget.label == "Detail Field 3") {
      this.isDisabled4 = false;
      this.value3 = event.detail.value;
    } else if (event.currentTarget.label == "Detail Field 4") {
      this.isDisabled5 = false;
      this.value4 = event.detail.value;
    } else if (event.currentTarget.label == "Detail Field 5") {
      this.value5 = event.detail.value;
    }
  }
  enableSave() {
    if (
      this.objName != "" &&
      this.conName != "" &&
      this.myLookupFld != "" &&
      this.value1 != "" &&
      this.value2 != "" &&
      this.value6 != "" &&
      this.value7 != ""
    ) {
      this.enableButtons = false;
    } else {
      this.enableButtons = true;
    }
  }

  connectedCallback() {
    this.disableFields();
    this.getRecordsFromSF();
  }
  getRecordsFromSF() {
    getRecList()
      .then(response => {
        this.myList = response;
        this.tempList = this.myList;
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  passValuesToForm(event) {
    this.template.querySelectorAll(".configNameRow").forEach(res => {
      res.classList.remove("highlightedConfig");
    });
    this.searchString = '';
    this.myList = this.tempList;
    this.illus = false;
    this.isDisabled = true;
    this.isDisabledRF = true;
    this.isDisabled1 = false;
    this.isDisabled2 = false;
    this.isDisabled3 = false;
    this.isDisabled4 = false;
    this.isDisabled5 = false;
    this.isDisabled6 = false;
    this.isDisabled7 = false;
    this.isDisabledvt = false;
    this.areButtonsVisible = true;
    this.showDelete = true;
    this.loaded = false;
    this.isDisabledName = false;

    event.currentTarget.classList.add("highlightedConfig");
    let recI = event.currentTarget.id.split("-")[0];
    this.currRecId = recI;
    const arr3 = this.myList.filter(d => d.Id === `${recI}`);
    this.currentRecord = arr3[0];
    this.conName = arr3[0].Name;
    this.myObjectName = arr3[0].ARH__Object__c;
    this.myLookupFld = arr3[0].ARH__Relationship_Field__c;
    this.value1 = arr3[0].ARH__Detail_Field_1__c;
    this.value2 = arr3[0].ARH__Detail_Field_2__c;
    this.value3 = arr3[0].ARH__Detail_Field_3__c;
    this.value4 = arr3[0].ARH__Detail_Field_4__c;
    this.value5 = arr3[0].ARH__Detail_Field_5__c;
    this.value6 = arr3[0].ARH__Visual_Field__c;
    this.value7 = arr3[0].ARH__Search_Field__c;
    this.visType = arr3[0].ARH__Visual_Type__c;
    this.configName = "for " + this.conName;

    this.visualType = this.visType;

    if (
      this.objName != "" &&
      this.conName != "" &&
      this.myLookupFld != "" &&
      this.value1 != "" &&
      this.value2 != "" &&
      this.value6 != "" &&
      this.value7 != ""
    ) {
      this.enableButtons = false;
    } else {
      this.enableButtons = true;
    }

    getSObjects()
      .then(response => {
        for (var key in response) {
          this.itemsON = [
            ...this.itemsON,
            {
              value: key,
              label: response[key]
            }
          ];
        }
      })
      .then(() => {
        getRFields({
          objName: arr3[0].ARH__Object__c
        }).then(response => {
          for (var key in response) {
            this.itemsRF = [
              ...this.itemsRF,
              {
                value: key,
                label: response[key]
              }
            ];
          }
        });
      })
      .then(() => {
        getNRFields({
            objName: arr3[0].ARH__Object__c
          })
          .then(response => {
            for (var key in response.AllFields) {
              this.itemsDT = [
                ...this.itemsDT,
                {
                  value: key,
                  label: response.AllFields[key]
                }
              ];
            }
            for (var key in response.search) {
              this.itemsSF = [
                ...this.itemsSF,
                {
                  value: key,
                  label: response.search[key]
                }
              ];
            }
            for (var key in response.vt) {
              this.itemsVT = [
                ...this.itemsVT,
                {
                  value: key,
                  label: response.vt[key]
                }
              ];
            }
          })
          .then(() => {
            this.loaded = !this.loaded;
          })
          .catch(error => {
            this.dispatchEvent(
              new ShowToastEvent({
                title: TOAST_ERROR_TITLE,
                message: error.message,
                variant: ERROR_VARIANT
              })
            );
          });
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  handleSave() {
    let cont = this.currentRecord;
    cont.ARH__Object__c = this.myObjectName;
    cont.Name = this.conName;
    cont.ARH__Relationship_Field__c = this.myLookupFld;
    cont.ARH__Detail_Field_1__c = this.value1;
    cont.ARH__Detail_Field_2__c = this.value2;
    cont.ARH__Detail_Field_3__c = this.value3;
    cont.ARH__Detail_Field_4__c = this.value4;
    cont.ARH__Detail_Field_5__c = this.value5;
    cont.ARH__Visual_Field__c = this.value6;
    cont.ARH__Search_Field__c = this.value7;
    cont.ARH__Visual_Type__c = this.visType;

    updateSObject({
        recordForUpdate: cont
      })
      .then(result => {
        this.template.querySelectorAll('.highlightedConfig').forEach(res => {
          res.classList.remove('highlightedConfig');
        });
        const evt = new ShowToastEvent({
          title: "Success",
          message: "Saved the record.",
          variant: "success"
        });
        this.dispatchEvent(evt);
        this.illus = true;
        this.cleanForm();
      })
      .then(() => {
        this.getRecordsFromSF();
      })
      .catch(error => {
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  handleNew() {
    this.template.querySelectorAll('.highlightedConfig').forEach(res => {
      res.classList.remove('highlightedConfig');
    });
    this.currentRecord = {};
    this.illus = false;
    this.loaded = false;
    this.disableFields();
    this.isDisabled = false;
    this.isDisabledName = false;
    this.resetFields();
    this.areButtonsVisible = false;
    this.showDelete = false;
    this.conName = "";
    this.myObjectName = "";
    this.configName = "";
    this.areButtonsVisible = true;
    this.showDelete = false;
    this.visualType = "";
    this.currentEditingField = "";
    if (
      this.objName != "" &&
      this.conName != "" &&
      this.myLookupFld != "" &&
      this.value1 != "" &&
      this.value2 != "" &&
      this.value6 != "" &&
      this.value7 != ""
    ) {
      this.enableButtons = false;
    } else {
      this.enableButtons = true;
    }
    getSObjects()
      .then(response => {
        response = Object.keys(response)
          .sort()
          .reduce((r, k) => ((r[k] = response[k]), r), {});
        for (var key in response) {
          this.itemsON = [
            ...this.itemsON,
            {
              value: response[key],
              label: key
            }
          ];
        }
      })
      .then(() => {
        this.loaded = !this.loaded;
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  handleCancel() {
    this.template.querySelectorAll('.highlightedConfig').forEach(res => {
      res.classList.remove('highlightedConfig');
    });
    this.illus = true;
    this.cleanForm();
    this.searchString = '';
    this.myList = this.tempList;

  }

  handleDelete() {
    deleteSObject({
        recordToDelete: this.currentRecord
      })
      .then(result => {
        this.closeModal();
        this.template.querySelectorAll('.highlightedConfig').forEach(res => {
          res.classList.remove('highlightedConfig');
        });
        const evt = new ShowToastEvent({
          title: "Success",
          message: "Deleted the record.",
          variant: "success"
        });
        this.dispatchEvent(evt);
        this.illus = true;
        this.cleanForm();
      })
      .then(() => {
        this.getRecordsFromSF();
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  disableFields() {
    this.isDisabled1 = true;
    this.isDisabled2 = true;
    this.isDisabled3 = true;
    this.isDisabled4 = true;
    this.isDisabled5 = true;
    this.isDisabled6 = true;
    this.isDisabled7 = true;
    this.isDisabledRF = true;
    this.isDisabledvt = true;
    this.isDisabledName = true;
  }

  resetFields() {
    this.value1 = "";
    this.value2 = "";
    this.value3 = "";
    this.value4 = "";
    this.value5 = "";
    this.value6 = "";
    this.value7 = "";
    this.visType = "";
    this.myLookupFld = "";
  }

  cleanForm() {
    this.itemsON = [];
    this.itemsRF = [];
    this.itemsDT = [];
    this.itemsSF = [];
    this.itemsVT = [];
    this.currentRecord = {};
    this.loaded = true;
    this.isDisabled = true;
    this.isDisabled1 = true;
    this.isDisabled2 = true;
    this.isDisabled3 = true;
    this.isDisabled4 = true;
    this.isDisabled5 = true;
    this.isDisabled6 = true;
    this.isDisabled7 = true;
    this.isDisabledvt = true;
    this.isDisabledName = true;
    this.isDisabledRF = true;
    this.isDisabledvt;
    this.configName = "";
    //All Field values
    this.conName = "";
    this.myObjectName = "";
    this.resetFields();
    this.currRecId = {};
    this.areButtonsVisible = false;
    this.showDelete = false;
    this.enableButtons = true;
    this.illus = true;
    this.searchString = "";
  }

  showFilterResult(event) {
    console.log(JSON.stringify(this.currentRecord.Id));
    this.myList = this.tempList;
    let x = event.target.value.toLowerCase();
    this.searchString = event.target.value;
    if (x.length == 0) {
      this.myList = this.myList;
      if (this.currentRecord.Id != '')
        this.template.querySelector("[Id*='" + this.currentRecord.Id + "']").classList.add('highlightedConfig');

    } else {
      this.myList = this.tempList.filter(d =>
        d.Name.toLowerCase().includes(`${event.target.value.toLowerCase()}`)
      );
    }
  }
}