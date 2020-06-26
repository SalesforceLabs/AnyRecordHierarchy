import { LightningElement, wire, track, api } from "lwc";
import searchRecords from "@salesforce/apex/anyRecordHierarchy.searchRecords";

const DELAY = 300;

export default class Search extends LightningElement {
  @api displayField;
  @api searchObject;

  @track searchResults = [];
  @track isExpanded = false;

  @api mode = null;
  @api parentRecordId = null;
  @api relationField = null;

  searchKey = "";
  loading = false;
  hasFocus = false;
  blurTimeout;

  @wire(searchRecords, {
    searchKey: "$searchKey",
    searchObj: "$searchObject",
    displayField: "$displayField",
    searchMode: "$mode",
    parentRecordId: "$parentRecordId",
    relationField: "$relationField"
  })
  fetchRecords({ error, data }) {
    this.loading = false;
    if (data) {
      this.searchResults = data.map((item) => {
        return { Id: item.Id, displayValue: item[this.displayField] };
      });
      if (this.searchResults.length > 0) {
        this.isExpanded = true;
      } else {
        this.isExpanded = false;
      }
      //console.log(this.searchResults);
      //this.error = undefined;
    } else if (error) {
      //this.error = error;
      this.searchResults = undefined;
    }
  }
  /* 
  handleSearch(){

  } */

  handleKeyChange(event) {
    if (!event.target.value) {
      this.isExpanded = true;
    }
    window.clearTimeout(this.delayTimeout);
    const searchKey = event.target.value;
    this.delayTimeout = setTimeout(() => {
      this.loading = true;
      this.searchKey = searchKey;
      //console.log(this.searchKey);
    }, DELAY);
  }

  handleResultClick(event) {
    const recordId = event.currentTarget.dataset.recordid;
    this.searchKey = event.currentTarget.dataset.displayvalue;

    this.searchResults = [{ Id: recordId, displayValue: this.searchKey }];
    //console.log(recordId);
    // Notify parent components that selection has changed

    const selectEvent = new CustomEvent("recordselect", {
      detail: recordId
    });
    this.dispatchEvent(selectEvent);

    //this.dispatchEvent(new CustomEvent('selectionchange'));
  }

  get resultsInit() {
    //console.log(this.searchResults.length == 0 && this.searchKey);
    return this.searchResults.length == 0;
  }

  handleBlur() {
    // Delay hiding combobox so that we can capture selected result
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.blurTimeout = window.setTimeout(() => {
      this.hasFocus = false;
      this.blurTimeout = null;
    }, 200);
  }

  handleFocus() {
    this.hasFocus = true;
  }

  handleComboboxClick() {
    // Hide combobox immediatly
    if (this.blurTimeout) {
      window.clearTimeout(this.blurTimeout);
    }
    this.hasFocus = false;
  }

  get getDropdownClass() {
    let css =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ";
    if (this.hasFocus && this.searchKey) {
      css += "slds-is-open";
    }
    return css;
  }

  get placeholderText() {
    return this.mode === "child"
      ? "Search child records here..."
      : "Search here...";
  }
}
