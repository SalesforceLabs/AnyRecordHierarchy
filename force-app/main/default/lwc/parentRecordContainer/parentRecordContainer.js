import { LightningElement, track, api } from "lwc";

export default class ParentRecordContainer extends LightningElement {
  @api parentRecords;
  @api currentRecord;
  @api configInfo;
  @api refObjNameFields;
  deviceSize = "MEDIUM";
  @api deviceSizeActual;
  @api visualType;
  transformObj;
  isHierarchy;
  loaded = true;
  isMoreItems = false;
  @api showParents;

  @track error;

  @track noOfPeersToShow = 3;

  @api
  get elementWidth() {
    return this.elementWidth;
  }
  set elementWidth(value) {
    this.setAttribute("elementWidth", value);
    this.noOfPeersToShow =
      value < 500
        ? 0
        : value < 670
        ? 1
        : value < 770
        ? 2
        : value < 1200
        ? 3
        : 4;
  }

  //peer functionality start

  @track currentLeftPeerArray;
  @track currentRightPeerArray;

  @api peerRecords;
  @api
  get leftPeerArray() {
    return this.currentLeftPeerArray;
    //return this._leftPeerArray;
  }
  set leftPeerArray(value) {
    //this._leftPeerArray = value;
    this.currentLeftPeerArray = value ? [...value] : [];
  }

  @api
  get rightPeerArray() {
    return this.currentRightPeerArray;
    //return this._rightPeerArray;
  }
  set rightPeerArray(value) {
    //this._rightPeerArray = value;
    this.currentRightPeerArray = value ? [...value] : [];
  }

  movePeerLeft() {
    try {
      if (this.currentLeftPeerArray.length > 0) {
        this.currentRightPeerArray.push(this.currentLeftPeerArray.shift());
      }
      this.currentLeftPeerArray.push(this.currentRecord[0]);
      this.currentRecord = [this.currentRightPeerArray.shift()];
      this.handleRecordClick({ detail: this.currentRecord[0].Id });
    } catch (err) {
      this.error = err;
    }
  }

  movePeerRight() {
    try {
      if (this.currentRightPeerArray.length > 0) {
        this.currentLeftPeerArray.unshift(this.currentRightPeerArray.pop());
      }
      this.currentRightPeerArray.unshift(this.currentRecord[0]);
      this.currentRecord = [this.currentLeftPeerArray.pop()];
      this.handleRecordClick({ detail: this.currentRecord[0].Id });
    } catch (err) {
      this.error = err;
    }
  }

  /* get peersLeft() {
    return this.currentLeftPeerArray.slice(
      Math.max(this.currentLeftPeerArray.length - 3, 0)
    );
  }
  get peersRight() {
    return this.currentRightPeerArray.slice(0, 3);
  } */

  get peers() {
    return {
      left: this.currentLeftPeerArray.slice(
        Math.max(this.currentLeftPeerArray.length - this.noOfPeersToShow, 0)
      ),
      right: this.currentRightPeerArray.slice(0, this.noOfPeersToShow)
    };
  }

  get activeControls() {
    return {
      left: this.currentLeftPeerArray.length > 0,
      right: this.currentRightPeerArray.length > 0
    };
  }

  get isSmallWidth() {
    return this.deviceSizeActual === "SMALL";
  }

  handlePeerRecordClick(event) {
    const evtDataset = event.currentTarget.dataset;
    const direction = evtDataset.dir;
    const pos = evtDataset.pos;
    const recId = evtDataset.id;
    let temp = this.currentRecord[0];
    if (direction === "left") {
      let recordPosition = this.currentLeftPeerArray.findIndex(
        (item) => item.Id === recId
      );
      this.currentRecord = [this.currentLeftPeerArray[recordPosition]];
      this.currentLeftPeerArray[recordPosition] = temp;
    } else if (direction === "right") {
      let recordPosition = this.currentRightPeerArray.findIndex(
        (item) => item.Id === recId
      );
      this.currentRecord = [this.currentRightPeerArray[recordPosition]];
      this.currentRightPeerArray[recordPosition] = temp;
    }
    this.handleRecordClick({ detail: this.currentRecord[0].Id });
  }

  //peer functionality end

  get tranformedParents() {
    if (this.parentRecords) {
      this.transformObj = JSON.parse(JSON.stringify(this.parentRecords));
      if (
        this.transformObj &&
        this.transformObj[0].Id !== this.currentRecord[0].Id
      ) {
        return (this.transformObj && this.transformObj.length) > 2
          ? this.transformObj.slice(0, 2).reverse()
          : this.transformObj.reverse();
      }
    }
  }

  get disableLoadMore() {
    if (this.parentRecords) {
      this.transformObj = JSON.parse(
        JSON.stringify(this.parentRecords)
      ).reverse();

      if (this.transformObj) {
        let trDisable =
          (this.transformObj && this.transformObj.length) > 2
            ? this.transformObj.slice(0, 2).reverse()
            : this.transformObj.reverse();

        if (trDisable.length > 1 && trDisable[0].hasOwnProperty("ParentId")) {
          this.isHierarchy = true;
        } else {
          this.isHierarchy = false;
        }
      }
    }
    return this.isHierarchy;
  }
  handleRecordClick(event) {
    const search = new CustomEvent("recordselect", {
      detail: event.detail
    });
    this.dispatchEvent(search);
  }

  get currentRecordStyle() {
    return this.deviceSize + " current-record";
  }

  refreshParent(event) {
    this.loaded = false;
    const search = new CustomEvent("showhierarchy", {
      detail: { Id: this.currentRecord[0].Id, Source: "parentComponent" }
    });
    this.dispatchEvent(search);
  }
}
