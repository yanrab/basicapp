/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/format/NumberFormat","sap/m/library","sap/ui/model/ChangeReason","sap/ui/base/ManagedObjectMetadata","sap/ui/core/HTML","sap/m/CustomListItem","sap/base/security/encodeXML"],function(t,e,i,o,s,r,n,a){"use strict";var l=i.ListType;var h=i.ListGrowingDirection;var g=t.extend("sap.m.GrowingEnablement",{constructor:function(e){t.apply(this);this._oControl=e;this._oControl.bUseExtendedChangeDetection=true;this._oControl.addDelegate(this);var i=this._oControl.getItems(true).length;this._iRenderedDataItems=i;this._iLimit=i;this._bLoading=false;this._sGroupingPath="";this._bDataRequested=false;this._oContainerDomRef=null;this._iLastItemsCount=0;this._iTriggerTimer=0;this._aChunk=[];this._oRM=null},destroy:function(){if(this._oTrigger){this._oTrigger.destroy();this._oTrigger=null}if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null}if(this._oRM){this._oRM.destroy();this._oRM=null}this._oControl.$("triggerList").remove();this._oControl.bUseExtendedChangeDetection=false;this._oControl.removeDelegate(this);this._oContainerDomRef=null;this._oControl=null},render:function(t){t.openStart("div",this._oControl.getId()+"-triggerList");t.class("sapMListUl").class("sapMGrowingList");t.style("display","none");t.openEnd();t.renderControl(this._getTrigger());t.close("div")},onAfterRendering:function(){var t=this._oControl;if(t.getGrowingScrollToLoad()){var e=i.getScrollDelegate(t);if(e){this._oScrollDelegate=e;e.setGrowingList(this.onScrollToLoad.bind(this),t.getGrowingDirection(),this._updateTrigger.bind(this,false))}}else if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null}if(!this._bLoading){this._updateTriggerDelayed(false)}},setTriggerText:function(t){this._oControl.$("triggerText").text(t)},reset:function(){this._iLimit=0;var t=this._oControl.getBindingInfo("items");this._oControl.oExtendedChangeDetectionConfig=!t||!t.template?null:{replace:true}},shouldReset:function(t){var e=o;return t==e.Sort||t==e.Filter||t==e.Context},getInfo:function(){return{total:this._oControl.getMaxItemsCount(),actual:this._iRenderedDataItems}},onScrollToLoad:function(){var t=this._oControl.getDomRef("triggerList");if(this._bLoading||!t||t.style.display!="none"){return}if(this._oControl.getGrowingDirection()==h.Upwards){var e=this._oScrollDelegate;this._oScrollPosition={left:e.getScrollLeft(),top:e.getScrollHeight()}}this.requestNewPage()},requestNewPage:function(){if(!this._oControl||this._bLoading){return}var t=this._oControl.getBinding("items");if(t&&!t.isLengthFinal()||this._iLimit<this._oControl.getMaxItemsCount()){if(this._oControl.getMetadata().hasProperty("enableBusyIndicator")){this._bParentEnableBusyIndicator=this._oControl.getEnableBusyIndicator();this._oControl.setEnableBusyIndicator(false)}this._iLimit+=this._oControl.getGrowingThreshold();this._updateTriggerDelayed(true);this.updateItems("Growing")}},_onBeforePageLoaded:function(t){this._bLoading=true;this._oControl.onBeforePageLoaded(this.getInfo(),t)},_onAfterPageLoaded:function(t){this._bLoading=false;this._updateTriggerDelayed(false);this._oControl.onAfterPageLoaded(this.getInfo(),t);if(this._oControl.setEnableBusyIndicator){this._oControl.setEnableBusyIndicator(this._bParentEnableBusyIndicator)}},_getTrigger:function(){var t=this._oControl.getId()+"-trigger",e=this._oControl.getGrowingTriggerText();e=e||sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LOAD_MORE_DATA");this._oControl.addNavSection(t);if(this._oTrigger){this.setTriggerText(e);return this._oTrigger}this._oTrigger=new n({id:t,busyIndicatorDelay:0,type:l.Active,content:new r({content:'<div class="sapMGrowingListTrigger">'+'<div class="sapMSLIDiv sapMGrowingListTriggerText">'+'<span class="sapMSLITitle" id="'+t+'Text">'+a(e)+"</span>"+"</div>"+'<div class="sapMGrowingListDescription sapMSLIDescription" id="'+t+'Info"></div>'+"</div>"})}).setParent(this._oControl,null,true).attachPress(this.requestNewPage,this).addDelegate({onsapenter:function(t){this.requestNewPage();t.preventDefault()},onsapspace:function(t){this.requestNewPage();t.preventDefault()},onAfterRendering:function(e){var i=this._oTrigger.$();i.removeAttr("aria-selected");i.attr({tabindex:0,role:"button","aria-labelledby":t+"Text"+" "+t+"Info"})}},this);this._oTrigger.getList=function(){};this._oTrigger.TagName="div";return this._oTrigger},_getListItemInfo:function(){return"[ "+this._iRenderedDataItems+" / "+e.getFloatInstance().format(this._oControl.getMaxItemsCount())+" ]"},_getGroupingPath:function(t){var e=t.aSorters||[];var i=e[0]||{};return i.fnGroup?i.sPath||"":""},_getDomIndex:function(t){if(typeof t!="number"){return t}if(this._oControl.hasPopin&&this._oControl.hasPopin()){return t*2}return t},_getHasScrollbars:function(){if(!this._oScrollDelegate){return false}if(this._iRenderedDataItems>=40){return true}return this._oScrollDelegate.getMaxScrollTop()>this._oControl.getDomRef("triggerList").clientHeight},destroyListItems:function(t){this._oControl.destroyItems(t);this._iRenderedDataItems=0;this._aChunk=[]},addListItem:function(t,e,i){var o=this._oControl,s=e.binding,r=this.createListItem(t,e);if(s.isGrouped()){var n=o.getItems(true),a=n[n.length-1],l=e.model,g=s.getGroup(r.getBindingContext(l));if(a&&a.isGroupHeader()){o.removeAggregation("items",a,true);this._fnAppendGroupItem=this.appendGroupItem.bind(this,g,a,i);a=n[n.length-1]}if(!a||g.key!==s.getGroup(a.getBindingContext(l)).key){var d=e.groupHeaderFactory?e.groupHeaderFactory(g):null;if(o.getGrowingDirection()==h.Upwards){this.applyPendingGroupItem();this._fnAppendGroupItem=this.appendGroupItem.bind(this,g,d,i)}else{this.appendGroupItem(g,d,i)}}}o.addAggregation("items",r,i);if(i){this._aChunk.push(r)}},applyPendingGroupItem:function(){if(this._fnAppendGroupItem){this._fnAppendGroupItem();this._fnAppendGroupItem=undefined}},appendGroupItem:function(t,e,i){e=this._oControl.addItemGroup(t,e,i);if(i){this._aChunk.push(e)}},createListItem:function(t,e){this._iRenderedDataItems++;var i=e.factory(s.uid("clone"),t);return i.setBindingContext(t,e.model)},updateItemsBindingContext:function(t,e){if(!t.length){return}var i=this._oControl.getItems(true);for(var o=0,s=0,r;o<i.length;o++){r=i[o];if(!r.isGroupHeader()){r.setBindingContext(t[s++],e)}}},applyChunk:function(t,e){this.applyPendingGroupItem();var i=this._aChunk.length;if(!i){return}if(this._oControl.getGrowingDirection()==h.Upwards){this._aChunk.reverse();if(t===true){t=0}else if(typeof t=="number"){t=this._iRenderedDataItems-i-t}}e=e||this._oContainerDomRef;this._oRM=this._oRM||sap.ui.getCore().createRenderManager();for(var o=0;o<i;o++){this._oRM.renderControl(this._aChunk[o])}this._oRM.flush(e,false,this._getDomIndex(t));this._aChunk=[]},addListItems:function(t,e,i){for(var o=0;o<t.length;o++){this.addListItem(t[o],e,i)}},rebuildListItems:function(t,e,i){this.destroyListItems(i);this.addListItems(t,e,i);if(i){var o=this._oContainerDomRef.contains(document.activeElement);this.applyChunk(false);o&&this._oControl.focus()}else{this.applyPendingGroupItem()}},insertListItem:function(t,e,i){var o=this.createListItem(t,e);this._oControl.insertAggregation("items",o,i,true);this._aChunk.push(o)},deleteListItem:function(t){this._oControl.getItems(true)[t].destroy(true);this._iRenderedDataItems--},refreshItems:function(t){if(!this._bDataRequested){this._bDataRequested=true;this._onBeforePageLoaded(t)}if(!this._iLimit||this.shouldReset(t)||!this._oControl.getItems(true).length){this._iLimit=this._oControl.getGrowingThreshold()}this._oControl.getBinding("items").getContexts(0,this._iLimit)},updateItems:function(t){var e=this._oControl,i=e.getBinding("items"),o=e.getBindingInfo("items"),s=e.getItems(true);if(!this._iLimit||this.shouldReset(t)||!s.length){this._iLimit=e.getGrowingThreshold()}if(this._bDataRequested){this._bDataRequested=false}else{this._onBeforePageLoaded(t)}var r=i.getContexts(0,this._iLimit)||[];if(r.dataRequested){this._bDataRequested=true;if(r.diff&&!r.diff.length){return}}this._oContainerDomRef=e.getItemsContainerDomRef();var n=r.diff,a=false,l;if(!r.length){this.destroyListItems()}else if(!this._oContainerDomRef){this.rebuildListItems(r,o)}else if(!n||!s.length&&n.length){if(e.shouldRenderItems()){this.rebuildListItems(r,o,true)}}else if(i.isGrouped()||e.checkGrowingFromScratch()){if(this._sGroupingPath!=this._getGroupingPath(i)){a=true}else{for(var h=0;h<n.length;h++){var g=n[h],d=r[g.index];if(g.type=="delete"||g.type=="replace"){a=true;break}else if(g.index!=this._iRenderedDataItems){a=true;break}else{this.addListItem(d,o,true);l=true}}}}else{if(this._sGroupingPath){e.removeGroupHeaders(true)}l=-1;var u=-1;for(var h=0;h<n.length;h++){var g=n[h],f=g.index,d=r[f];if(g.type=="delete"){if(l!=-1){this.applyChunk(l);u=-1;l=-1}this.deleteListItem(f)}else if(g.type=="insert"){if(l==-1){l=f}else if(u>-1&&f!=u+1){this.applyChunk(l);l=f}this.insertListItem(d,o,f);u=f}}}if(a){this.rebuildListItems(r,o,true)}else if(this._oContainerDomRef&&n){this.updateItemsBindingContext(r,o.model);this.applyChunk(l)}this._oContainerDomRef=null;this._sGroupingPath=this._getGroupingPath(i);if(!this._bDataRequested){this._onAfterPageLoaded(t)}},_updateTriggerDelayed:function(t){if(this._oControl.getGrowingScrollToLoad()){this._iTriggerTimer&&window.cancelAnimationFrame(this._iTriggerTimer);this._iTriggerTimer=window.requestAnimationFrame(this._updateTrigger.bind(this,t))}else{this._updateTrigger(t)}},_updateTrigger:function(t){var e=this._oTrigger,i=this._oControl;if(!e||!i||!i.shouldRenderItems()||!i.getDomRef()){return}var o=i.getBinding("items");if(!o){return}e.setBusy(t);e.$().toggleClass("sapMGrowingListBusyIndicatorVisible",t);if(t){e.setActive(false);i.$("triggerList").css("display","")}else{var s=i.getItems(true),r=s.length,n=o.getLength()||0,a=o.isLengthFinal(),l=i.getGrowingScrollToLoad(),g=e.getDomRef();if(g&&g.contains(document.activeElement)){(s[this._iLastItemsCount]||i).focus()}if(!r||!this._iLimit||a&&this._iLimit>=n||l&&this._getHasScrollbars()){i.$("triggerList").css("display","none")}else{if(a){i.$("triggerInfo").css("display","block").text(this._getListItemInfo())}e.$().removeClass("sapMGrowingListBusyIndicatorVisible");i.$("triggerList").css("display","")}this._iLastItemsCount=this._oControl.getItems(true).length;if(l&&this._oScrollPosition===undefined&&i.getGrowingDirection()==h.Upwards){this._oScrollPosition={left:0,top:0}}if(r>0&&this._oScrollPosition){var d=this._oScrollDelegate,u=this._oScrollPosition;d.scrollTo(u.left,d.getScrollHeight()-u.top);this._oScrollPosition=null}}}});return g});