import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

const classMap = {
  "show-label": "truncate-width-small",
  "no-width": "maxHeight"
};

export default class Field extends NavigationMixin(LightningElement) {
  @api fieldMetadata;
  @api fieldData;
  @api deviceSize;
  @api variant;

  get isShowLabel() {
    return this.variant === "show-label";
  }

  get containerClass() {
    return this.variant === "show-label"
      ? this.deviceSize + " flexClass"
      : this.deviceSize;
  }

  get valueClass() {
    let baseClass = "slds-truncate ";
    let widthClass = classMap[this.variant] || "truncate-width";
    return baseClass + widthClass;
  }

  connectedCallback() {}

  get isDate() {
    let types = ["date"];
    return types.indexOf(this.fieldMetadata.type) !== -1;
  }

  get isDateTime() {
    let types = ["datetime"];
    return types.indexOf(this.fieldMetadata.type) !== -1;
  }

  get isTime() {
    return this.fieldMetadata.type === "time";
  }

  get isLocation() {
    return this.fieldMetadata.type === "location";
  }

  get isString() {
    let types = ["id", "string", "picklist", "multipicklist"];
    return (
      types.indexOf(this.fieldMetadata.type) !== -1 &&
      this.fieldMetadata.nameField !== true &&
      this.fieldMetadata.htmlFormatted !== true
    );
  }

  get isRichTextArea() {
    return this.fieldMetadata.htmlFormatted === true;
  }

  get isCurrency() {
    let types = ["currency"];
    return types.indexOf(this.fieldMetadata.type) !== -1;
  }

  get isDouble() {
    let types = ["double", "int"];
    return types.indexOf(this.fieldMetadata.type) !== -1;
  }

  get isPhone() {
    return this.fieldMetadata.type === "phone";
  }

  get isEmail() {
    return this.fieldMetadata.type === "email";
  }

  get isURL() {
    return this.fieldMetadata.type === "url";
  }

  get isPercent() {
    let types = ["percent"];
    return types.indexOf(this.fieldMetadata.type) !== -1;
  }

  get isReference() {
    return (
      this.fieldMetadata.type === "reference" ||
      this.fieldMetadata.nameField === true
    );
  }

  get isBoolean() {
    return this.fieldMetadata.type === "boolean";
  }

  get containsValue() {
    return typeof this.fieldData.value !== "undefined";
  }

  navigateToRec(event) {
    //event.preventDefault();
    //alert("implement Record Nav");
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.currentTarget.dataset.referencerecid,
        actionName: "view"
      }
    });
    event.stopPropagation();
  }
}
