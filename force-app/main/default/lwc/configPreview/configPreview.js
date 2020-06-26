import { LightningElement, api } from "lwc";

export default class ConfigPreview extends LightningElement {
  @api visual = "Image";
  @api field = "Visual Type";

  get visualType() {
    return {
      image: this.visual === "Image" ? "" : "slds-hide",
      abbr: this.visual === "Abbreviation" ? "" : "slds-hide"
    };
  }

  get currentPreview() {
    let visualClass = "slds-avatar slds-avatar_circle avatarcircleBig";
    return {
      visual:
        this.field === "Image/Abbreviation Field" ||
        this.field === "Visual Type"
          ? visualClass + " shadow"
          : visualClass,
      df1: this.field === "Detail Field 1" ? "shadow" : "",
      df2: this.field === "Detail Field 2" ? "shadow" : "",
      df3: this.field === "Detail Field 3" ? "shadow" : "",
      df4: this.field === "Detail Field 4" ? "shadow" : ""
    };
  }
}