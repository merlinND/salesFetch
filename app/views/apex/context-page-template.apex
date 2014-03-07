<apex:page id="salesFetch{{record_type}}Page" StandardController="{{record_type}}">'
  <c:SalesFetchIframeComponent ObjectType="{{record_type}}" SalesforceRecordId="{!{{record_type}}.Id}" />
</apex:page>