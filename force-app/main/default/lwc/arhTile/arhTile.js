import { LightningElement, api } from "lwc";
import defaultTemplate from "./arhTile.html";
import listTileTemplate from "./arhListTile.html";
import headerTemplate from "./arhTileHeader.html";

const templateMap = {
  list: listTileTemplate,
  header: headerTemplate
};

export default class ArhTile extends LightningElement {
  @api record;
  @api metadata;
  @api refObjNameFields;
  @api isMoreItems;
  @api deviceSize;
  @api visualType;
  @api mode;

  render() {
    return templateMap.hasOwnProperty(this.mode)
      ? templateMap[this.mode]
      : defaultTemplate;
  }

  showPopover = false;
  get fieldData() {
    let formattedData = Object.keys(this.metadata).reduce((data, item) => {
      let dataValues = {
        value: this.record[this.metadata[item].name]
      };
      if (dataValues.value) {
        if (this.metadata[item].type === "reference") {
          let relationName = this.metadata[item].relationshipName;
          dataValues.referenceValue = this.record[relationName][
            this.refObjNameFields[relationName]
          ];
        }
        if (
          this.metadata[item].nameField === true &&
          item !== "ARH__Visual_Field__c"
        ) {
          dataValues.value = this.record.Id;
          dataValues.referenceValue = this.record[this.metadata[item].name];
        }
        if (this.metadata[item].type === "datetime") {
          dataValues.value = Date.parse(dataValues.value);
          //const tempDate = new Date(dataValues.value);
          //dataValues.value = "2020-05-14T09:55:43.320Z"; //tempDate.toISOString();
        }
        if (this.metadata[item].type === "time") {
          dataValues.value = Date.parse(
            "02 Jan 1970 " + dataValues.value + " GMT"
          );
        }
        if (this.metadata[item].type === "percent") {
          dataValues.value = dataValues.value / 100;
        }
      }
      data[item] = dataValues;
      return data;
    }, {});

    //visualize logic
    if (this.visualType == "Abbreviation") {
      const textToAbbr = formattedData.ARH__Visual_Field__c.value;
      if (textToAbbr) {
        let words = textToAbbr.split(" ");
        let abbr;
        if (words.length > 1) {
          abbr = words[0].charAt(0) + words[words.length - 1].charAt(0);
        } else {
          abbr = words[0].slice(0, 2);
        }
        formattedData.ARH__Visual_Field__c.value = abbr.toUpperCase();
      }
    }

    return formattedData;
  }

  get isCurrentRecord() {
    return this.deviceSize === "MEDIUM current-record" ? true : false;
  }

  selectRecord() {
    const searchEvent = new CustomEvent("recordclick", {
      detail: this.record.Id
    });
    this.dispatchEvent(searchEvent);
  }

  fireMoreEvent() {
    const showallEvent = new CustomEvent("showall", { detail: this.record.Id });
    this.dispatchEvent(showallEvent);
  }

  showPopOver() {
    if (this.deviceSize !== "SMALL") {
      this.showPopover = true;
    }
  }

  hidePopOver() {
    this.showPopover = false;
  }

  get visual() {
    return {
      Abbreviation: this.visualType == "Abbreviation",
      Image: this.visualType == "Image"
    };
  }
}
