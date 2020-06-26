import { LightningElement, track, api } from "lwc";
import logo_noimage from "@salesforce/resourceUrl/noimage";

export default class Avatar extends LightningElement {
  noimgLogoUrl = logo_noimage;
  @track _src = "";

  @api fallbackIconName;
  @api deviceSize;
  @api initials;

  @api get src() {
    return this._src;
  }
  set src(value) {
    this._src = (typeof value === "string" && value.trim()) || "";
  }

  get showInitials() {
    return !this._src && this.initials;
  }

  get showIcon() {
    return !this._src && !this.initials;
  }

  handleImageError(event) {
    this._src = "";
  }
}
