import { LightningElement, api, track } from "lwc";
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class ChildRecordContainer extends LightningElement {
  @track numberOfPages;
  @track pageNumber = 1;
  @track showAllMobile = false;
  @track showParents;
  @api
  get showParent() {
    return this.showParents;
  }
  set showParent(value) {
    this.showParents = value;
    if (FORM_FACTOR === "Small") {
      this.showAllMobile = !value;
    }
  }

  pageSize = 30;
  @api childRecords;

  @api configInfo;
  @api refObjNameFields;
  @api deviceSize;
  @api visualType;

  @api relationField;
  @api searchDisplayField;
  @api parentRecordId;
  @api objectApiName;

  @track minChildRecords;

  isDefaultItems = false;

  connectedCallback() {
    if (FORM_FACTOR === "Small") {
      this.pageSize = 10;
    }
    //console.log("connected callback");
  }

  get showSome() {
    if (FORM_FACTOR === "Large") {
      return true;
    } else if (FORM_FACTOR === "Small" || FORM_FACTOR === "Medium") {
      return this.showParents;
    }
  }

  /* 
  get showViewAll() {
    return (
      (FORM_FACTOR === "Large" || this.showAllMobile) &&
      this.childRecords.length > 0
    );
  } */

  get childsToShow() {
    return this.childRecords.slice(0, 8);
  }

  get isMoreFlag() {
    return this.childRecords.length > 8;
  }

  get isChildRecords() {
    return this.childRecords.length > 0 ? true : false;
  }

  handleRecordClick(event) {
    /* if (FORM_FACTOR === "Small") {
      this.setParentVisibility(true);
    } */
    const search = new CustomEvent("recordselect", {
      detail: event.detail
    });
    this.dispatchEvent(search);
  }

  showMoreItems() {
    const viewall = new CustomEvent("viewall", {
      detail: "isVisible"
    });
    this.dispatchEvent(viewall);
  }

  /* setParentVisibility(isVisible) {
    const setparentsvisible = new CustomEvent("setparentsvisible", {
      detail: isVisible
    });
    this.dispatchEvent(setparentsvisible);
  } */
}
