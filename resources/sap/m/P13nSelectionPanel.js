/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","./ColumnListItem","./P13nPanel","./SearchField","./Text","./Table","./Column","./ScrollContainer","./P13nSelectionItem","./VBox","./Link","./OverflowToolbar","./OverflowToolbarLayoutData","./ToolbarSpacer","sap/ui/core/library","sap/ui/model/ChangeReason","sap/ui/model/json/JSONModel","sap/ui/model/BindingMode","sap/ui/core/ResizeHandler","sap/ui/thirdparty/jquery"],function(e,t,i,n,r,o,s,l,a,d,h,c,u,p,g,f,m,I,_,y){"use strict";var b=e.ToolbarDesign;var v=e.ListType;var M=e.ListMode;var S=e.P13nPanelType;var T=i.extend("sap.m.P13nSelectionPanel",{metadata:{library:"sap.m",aggregations:{selectionItems:{type:"sap.m.P13nSelectionItem",multiple:true,singularName:"selectionItem",bindable:"bindable"},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",visibility:"hidden"}},events:{changeSelectionItems:{parameters:{items:{type:"object[]"}}}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapMP13nColumnsPanel");e.openEnd();t.getAggregation("content").forEach(function(t){e.renderControl(t)});e.close("div")}}});T.prototype.init=function(){this._iLiveChangeTimer=0;this._iSearchTimer=0;this._bIgnoreUpdateInternalModel=false;this._bUpdateInternalModel=true;this._bOnAfterRenderingFirstTimeExecuted=false;var e=new m({items:[],countOfSelectedItems:0,countOfItems:0});e.setDefaultBindingMode(I.TwoWay);e.setSizeLimit(1e3);this.setModel(e,"$sapmP13nSelectionPanel");this.setType(S.selection);this._createTable();this._createToolbar();this.setVerticalScrolling(false);var t=new l({horizontal:false,vertical:true,content:[this._oTable],width:"100%",height:"100%"});this.addAggregation("content",t);var i=this;this._fnHandleResize=function(){var e=false,n,r;if(i.getParent){var o=null,s,l;var a=i.getParent();var d=i._getToolbar();if(a&&a.$){o=a.$("cont");if(o.children().length>0&&d.$().length>0){n=t.$()[0].clientHeight;s=o.children()[0].clientHeight;l=d?d.$()[0].clientHeight:0;r=s-l;if(n!==r){t.setHeight(r+"px");e=true}}}}return e};this._sContainerResizeListener=_.register(t,this._fnHandleResize)};T.prototype.onBeforeRendering=function(){this._updateInternalModel()};T.prototype.onAfterRendering=function(){var e=this;if(!this._bOnAfterRenderingFirstTimeExecuted){this._bOnAfterRenderingFirstTimeExecuted=true;window.clearTimeout(this._iLiveChangeTimer);this._iLiveChangeTimer=window.setTimeout(function(){e._fnHandleResize()},0)}};T.prototype.getOkPayload=function(){this._updateInternalModel();var e=this._getInternalModel().getProperty("/items");return{selectionItems:e.map(function(e){return{columnKey:e.columnKey,selected:e.persistentSelected}})}};T.prototype.exit=function(){_.deregister(this._sContainerResizeListener);this._sContainerResizeListener=null;this._getToolbar().destroy();this._oTable.destroy();this._oTable=null;if(this._getInternalModel()){this._getInternalModel().destroy()}window.clearTimeout(this._iLiveChangeTimer);window.clearTimeout(this._iSearchTimer)};T.prototype.addItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.addAggregation("items",e);return this};T.prototype.insertItem=function(e,t){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.insertAggregation("items",e,t);return this};T.prototype.removeItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}e=this.removeAggregation("items",e);return e};T.prototype.removeAllItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAllAggregation("items")};T.prototype.destroyItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.destroyAggregation("items");return this};T.prototype.addSelectionItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.addAggregation("selectionItems",e);return this};T.prototype.insertSelectionItem=function(e,t){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.insertAggregation("selectionItems",e,t);return this};T.prototype.updateSelectionItems=function(e){this.updateAggregation("selectionItems");if(e===f.Change&&!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}};T.prototype.removeSelectionItem=function(e){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAggregation("selectionItems",e)};T.prototype.removeAllSelectionItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}return this.removeAllAggregation("selectionItems")};T.prototype.destroySelectionItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true}this.destroyAggregation("selectionItems");return this};T.prototype.onBeforeNavigationFrom=function(){return true};T.prototype._notifyChange=function(){var e=this.getChangeNotifier();if(e){e(this)}};T.prototype._getInternalModel=function(){return this.getModel("$sapmP13nSelectionPanel")};T.prototype._createTable=function(){var e=this;this._oTable=new o({mode:M.MultiSelect,rememberSelections:false,selectionChange:y.proxy(this._onSelectionChange,this),columns:[new s({vAlign:g.VerticalAlign.Middle,header:new r({text:{parts:[{path:"/countOfSelectedItems"},{path:"/countOfItems"}],formatter:function(e,t){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("COLUMNSPANEL_SELECT_ALL_WITH_COUNTER",[e,t])}}})})],items:{path:"/items",templateShareable:false,template:new t({cells:new d({items:[new h({href:"{href}",text:"{text}",target:"{target}",enabled:{path:"href",formatter:function(e){if(!e){this.addStyleClass("sapUiCompSmartLink")}return!!e}},press:function(t){var i=t.getSource().getHref();var n=e.getItems().filter(function(e){return e.getHref()===i&&!!e.getPress()});if(!n.length){return}var r=n[0].getPress();r(t)}}),new r({visible:{path:"description",formatter:function(e){return!!e}},text:"{description}"})]}),visible:"{visible}",selected:"{persistentSelected}",tooltip:"{tooltip}",type:v.Active})}});this._oTable.setModel(this._getInternalModel())};T.prototype._createToolbar=function(){var e=this;var t=new c(this.getId()+"-toolbar",{design:b.Auto,content:[new p,new n(this.getId()+"-searchField",{liveChange:function(t){var i=t.getSource().getValue(),n=i?300:0;window.clearTimeout(e._iSearchTimer);if(n){e._iSearchTimer=window.setTimeout(function(){e._onExecuteSearch()},n)}else{e._onExecuteSearch()}},search:y.proxy(this._onExecuteSearch,this),layoutData:new u({minWidth:"12.5rem",maxWidth:"23.077rem",shrinkable:true,moveToOverflow:false,stayInOverflow:false})})]});t.setModel(this._getInternalModel());this.addAggregation("content",t)};T.prototype._onExecuteSearch=function(){this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();this._updateControlLogic()};T.prototype._switchVisibilityOfUnselectedModelItems=function(){var e=this._isFilteredByShowSelected();var t=this._getInternalModel().getProperty("/items");t.forEach(function(t){if(t.persistentSelected){t.visible=true;return}t.visible=!e});this._getInternalModel().setProperty("/items",t)};T.prototype._getVisibleModelItems=function(){return this._getInternalModel().getProperty("/items").filter(function(e){return!!e.visible})};T.prototype._getModelItemByColumnKey=function(e){var t=this._getInternalModel().getProperty("/items").filter(function(t){return t.columnKey===e});return t[0]};T.prototype._updateCounts=function(e){var t=0;var i=0;e.forEach(function(e){t++;if(e.persistentSelected){i++}});this._getInternalModel().setProperty("/countOfItems",t);this._getInternalModel().setProperty("/countOfSelectedItems",i)};T.prototype._getToolbar=function(){return sap.ui.getCore().byId(this.getId()+"-toolbar")||null};T.prototype._getSearchField=function(){return sap.ui.getCore().byId(this.getId()+"-searchField")||null};T.prototype._getSearchText=function(){var e=this._getSearchField();return e?e.getValue():""};T.prototype._isFilteredBySearchText=function(){return!!this._getSearchText().length};T.prototype._isFilteredByShowSelected=function(){return false};T.prototype._updateControlLogic=function(){var e=this._isFilteredBySearchText();var t=this._isFilteredByShowSelected();var i=sap.ui.getCore().byId(this._oTable.getId()+"-sa");if(i){i.setEnabled(!e&&!t)}};T.prototype._fireChangeSelectionItems=function(){this._bIgnoreUpdateInternalModel=true;var e=this._getInternalModel().getProperty("/items");this.fireChangeSelectionItems({items:e.map(function(e){return{columnKey:e.columnKey,selected:e.persistentSelected}})});this._bIgnoreUpdateInternalModel=false};T.prototype._onSelectionChange=function(){this._selectTableItem()};T.prototype._selectTableItem=function(){var e=this._getInternalModel().getProperty("/items");this._updateCounts(e);this._getInternalModel().setProperty("/items",e);this._fireChangeSelectionItems();this._notifyChange()};T.prototype._filterModelItemsBySearchText=function(){var e=this._getSearchText();e=e.replace(/(^\s+)|(\s+$)/g,"");e=e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");var t=new RegExp(e,"igm");this._getVisibleModelItems().forEach(function(e){e.visible=false;if(e.text&&e.text.match(t)){e.visible=true}if(e.tooltip&&e.tooltip.match(t)){e.visible=true}});this._getInternalModel().refresh()};T.prototype._updateInternalModel=function(){if(!this._bUpdateInternalModel){return}this._bUpdateInternalModel=false;this._getInternalModel().setProperty("/items",this.getItems().map(function(e){return{columnKey:e.getColumnKey(),visible:true,text:e.getText(),tooltip:e.getTooltip(),href:e.getHref(),target:e.getTarget(),persistentSelected:e.getVisible(),description:e.getDescription()}},this));this.getSelectionItems().forEach(function(e){var t=this._getModelItemByColumnKey(e.getColumnKey());if(!t){return}if(e.getSelected()!==undefined){t.persistentSelected=e.getSelected()}},this);this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();var e=this._getInternalModel().getProperty("/items");this._updateCounts(e);this._getInternalModel().setProperty("/items",e)};return T});