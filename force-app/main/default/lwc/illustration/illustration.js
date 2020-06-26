import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class Illustration extends NavigationMixin(LightningElement) {
  @api errorData;

  get illustrationClass() {
    let classStr = "slds-illustration slds-illustration_";
    return this.errorData.name == "Howdy! Fancy a hierarchy?"
      ? classStr + "large"
      : classStr + "small";
  }

  navigateToTabPage() {
    // Navigate to a specific CustomTab.
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "ARH__ARH_Configuration"
      }
    });
  }

  get illustrationType() {
    return {
      noaccess: this.errorData.code == 403,
      configexcption: this.errorData.code == 400 || this.errorData.code == 404,
      noconfig: this.errorData.code == 100,
      newconfig: this.errorData.code == 200
    };
  }
}