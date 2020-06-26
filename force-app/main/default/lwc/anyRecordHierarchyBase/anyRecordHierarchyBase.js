import { LightningElement, api, wire, track } from "lwc";
import getRecords from "@salesforce/apex/anyRecordHierarchy.getRecords";
import getConfig from "@salesforce/apex/anyRecordHierarchy.getConfig";
import getSObjectHierarchy from "@salesforce/apex/anyRecordHierarchy.getSObjectHierarchy";
import getPeerRecords from "@salesforce/apex/anyRecordHierarchy.getPeerRecords";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import FORM_FACTOR from "@salesforce/client/formFactor";

const TOAST_ERROR_TITLE = "Error occured!";
const ERROR_VARIANT = "error";

export default class AnyRecordHierarchyBase extends LightningElement {
  @api recordId;
  @api configId;
  @api flexipageRegionWidth;
  @api objectApiName;
  @api pageTitle = "Record Hierarchy";

  @track showParents = true;

  configData;
  configData_Object;
  configData_RelationField;
  @track configDataError;
  isRendered;

  childRecords;

  @track configMetadata;
  @track refObjNameFields;
  relationField;
  queryString;
  @track hierarchyData;
  @track visualType;
  @track parentHierarchy;
  @track searchDisplayField;
  allhierarchy = false;
  error;
  isRendered;
  loaded = false;

  @track elementWidth;

  @track showAllMobile = false;

  //peer functionality start

  @track peerRecords;
  @track leftPeerArray;
  @track rightPeerArray;

  //peer functionality end

  @track viewAllChildRecords = false;

  connectedCallback() {
    window.addEventListener("resize", this.setParentElmWidth.bind(this));
  }

  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.setParentElmWidth();
    this.isRendered = true;
  }
  //peer functionality start

  setParentElmWidth() {
    this.elementWidth = this.template.querySelector(
      ".hierarchyContainerMain"
    ).clientWidth;
  }

  @wire(getConfig, { configId: "$configId" })
  configDetails({ error, data }) {
    if (data) {
      const formattedData = JSON.parse(data);
      this.configMetadata = JSON.parse(formattedData.metadata);
      this.refObjNameFields = JSON.parse(formattedData.refObjNameFields);
      this.queryString = formattedData.queryString;
      this.relationField = formattedData.relationField;
      this.visualType = formattedData.visualType;
      this.searchDisplayField = formattedData.searchField;
    } else if (error) {
      if (
        error.body.message ==
          "Value provided is invalid for action parameter 'configId' of type 'Id'" &&
        this.configId == "None"
      ) {
        this.configDataError = {
          name: "No Configurations Selected",
          message:
            "No Hierarchy Configurations was selected for this Object. Please edit this page and select the configuration for this component, If you do not have the configuration for this object please create one by clicking the below button.",
          code: 100
        };
      } else {
        this.configDataError = JSON.parse(error.body.message);
      }
    }
  }

  @wire(getRecords, {
    queryString: "$queryString",
    relationField: "$relationField",
    currentRecId: "$recordId"
  })
  allRecords({ error, data }) {
    if (data) {
      this.loaded = true;
      this.hierarchyData = JSON.parse(data);
      this.loadPeers();
      this.allhierarchy = false;
    } else if (error) {
      this.error = error;
      this.dispatchEvent(
        new ShowToastEvent({
          title: TOAST_ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        })
      );
    }
  }

  loadPeers() {
    const parentRecId = this.hierarchyData.currentRecord[0][this.relationField];
    let sameParentIdx;
    if (this.peerRecords) {
      sameParentIdx = this.peerRecords.findIndex(
        (item) => item[this.relationField] === parentRecId
      );
    }
    if (!this.peerRecords || sameParentIdx === -1) {
      this.splitPeers([]);
      this.loaded = false;
      getPeerRecords({
        queryString: this.queryString,
        relationField: this.relationField,
        parentRecordId: parentRecId,
        currentRecId: this.recordId
      })
        .then((result) => {
          this.splitPeers(result);
          this.loaded = true;
        })
        .catch((error) => {
          this.error = error;
          this.peerRecords = undefined;
          this.leftPeerArray = undefined;
          this.rightPeerArray = undefined;
          this.dispatchEvent(
            new ShowToastEvent({
              title: TOAST_ERROR_TITLE,
              message: error.message,
              variant: ERROR_VARIANT
            })
          );
        });
    }
  }

  splitPeers(result) {
    this.peerRecords = result;
    let arrLength = this.peerRecords.length;
    this.leftPeerArray = this.peerRecords.slice(0, Math.floor(arrLength / 2));
    this.rightPeerArray = this.peerRecords.slice(Math.floor(arrLength / 2));
  }

  loadParents(id) {
    getSObjectHierarchy({
      queryString: this.queryString,
      relationField: this.relationField,
      recordId: id
    })
      .then((result) => {
        if (this.parentHierarchy) {
          this.transformObj = JSON.parse(
            JSON.stringify(this.parentHierarchy)
          ).reverse();
          Array.prototype.push.apply(result.reverse(), this.transformObj);
          this.parentHierarchy = result.reverse();
        } else {
          this.parentHierarchy = result;
        }
        this.loaded = true;
      })
      .catch((error) => {
        this.error = error;
        this.contacts = undefined;
        this.dispatchEvent(
          new ShowToastEvent({
            title: TOAST_ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      });
  }

  handleRecordSelect(event) {
    if (this.showAllMobile) {
      this.showAllMobile = false;
    }
    this.recordId = event.detail;
  }

  handleRefreshevent(event) {
    this.allhierarchy = true;
    this.parentHierarchy = null;
    if (event.detail) {
      this.loadParents(event.detail);
    }
  }

  showHierarchy(event) {
    this.allhierarchy = true;
    this.loaded = false;
    if (event.detail.Source === "parentComponent") {
      this.parentHierarchy = null;
    }
    if (event.detail.Id) {
      this.loadParents(event.detail.Id);
    }
  }

  handleHomeEvent(event) {
    this.allhierarchy = false;
    if (event.detail) {
      this.loadParents(event.detail);
    }
  }

  handleParentVisibility(event) {
    this.showParents = event.detail;
  }

  handleShowParents() {
    this.showAllMobile = false;
    this.showParents = true;
  }

  showMoreItems() {
    if (FORM_FACTOR === "Large") {
      this.template.querySelector("c-view-all-child-records").openModal();
    } else if (FORM_FACTOR === "Small" || FORM_FACTOR === "Medium") {
      this.showAllMobile = true;
      this.showParents = false;
    }
  }

  get showViewAll() {
    return (
      (FORM_FACTOR === "Large" || this.showAllMobile) &&
      this.hierarchyData.childRecords.length > 0
    );
  }
}
