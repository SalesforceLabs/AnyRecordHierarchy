import { LightningElement, api, track } from "lwc";
import FORM_FACTOR from "@salesforce/client/formFactor";

export default class ViewAllChildRecords extends LightningElement {
  @track allChildRecords;
  @track numberOfPages;
  @track pageNumber = 1;
  pageSize = FORM_FACTOR === "Large" ? 20 : 6;

  @api
  get childRecords() {
    return this.allChildRecords;
  }
  set childRecords(value) {
    this.allChildRecords = value;
    this.numberOfPages = this.childRecords
      ? Math.ceil(this.childRecords.length / this.pageSize)
      : 0;
  }

  @api configInfo;
  @api refObjNameFields;
  @api deviceSize;
  @api visualType;

  @api relationField;
  @api searchDisplayField;
  @api parentRecordId;
  @api objectApiName;

  connectedCallback() {
    console.log(JSON.stringify(this));
    /* if (FORM_FACTOR === "Small") {
      //this.pageSize = 9;
      //this.setPageNumbers();
    } */
    //console.log("connected callback");
  }

  /* more child mobile list start */
  get isMobile() {
    return FORM_FACTOR === "Small" || FORM_FACTOR === "Medium";
  }
  /* more child mobile list end */

  get isDesktop() {
    return FORM_FACTOR === "Large";
  }

  get paginatedChilds() {
    return this.allChildRecords.slice(
      (this.pageNumber - 1) * this.pageSize,
      this.pageNumber * this.pageSize
    );
  }

  get modalFooterData() {
    return {
      totalChilds: `${this.allChildRecords.length} records`,
      prevDisabled: this.pageNumber === 1,
      nextDisabled: this.pageNumber === this.numberOfPages
    };
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1;
    }
  }
  nextPage() {
    if (this.pageNumber < this.numberOfPages) {
      this.pageNumber += 1;
    }
  }

  changePage(evt) {
    let selectedPage = Number(evt.detail.value);
    if (selectedPage > 0 && selectedPage <= this.numberOfPages) {
      this.pageNumber = selectedPage;
    }
  }

  handleRecordClick(event) {
    this.resetPage();
    const search = new CustomEvent("recordselect", {
      detail: event.detail
    });
    this.dispatchEvent(search);
  }

  resetPage() {
    if (FORM_FACTOR === "Small" || FORM_FACTOR === "Medium") {
      const setparentsvisible = new CustomEvent("setparentsvisible", {
        detail: true
      });
      this.dispatchEvent(setparentsvisible);
    } else if (FORM_FACTOR === "Large") {
      this.isModalOpen = false;
    }
    this.pageNumber = 1;
  }

  @track isModalOpen = false;

  //sets the isModalOpen property to true, indicating that the Modal is Open
  showModal() {
    this.isModalOpen = true;
  }

  //sets the isModalOpen property to false, indicating that the Modal is Closed
  closeModal() {
    this.isModalOpen = false;
    this.resetPage();
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
    return `slds-modal slds-modal_medium ${
      this.isModalOpen ? "slds-fade-in-open" : ""
    }`;
  }

  //compute the CSS classes of the Modal Backdrop(grey overlay) based on the value of isModalOpen property
  get modalBackdropClass() {
    return `slds-backdrop ${this.isModalOpen ? "slds-backdrop_open" : ""}`;
  }

  @api openModal() {
    this.isModalOpen = true;
  }
}
