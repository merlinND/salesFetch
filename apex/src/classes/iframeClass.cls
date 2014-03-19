public class iframeClass{
    public String contextType {get; set;}
    public String contextId {get; set;}

    private Object getUserInfos() {
        Map<String, Object> user = new Map<String, Object>();
        user.put('id', userinfo.getUserId());
        user.put('name', userinfo.getUserName());
        user.put('email', userinfo.getUserEmail());

       	return user;
    }

    private Object getOrgInfos() {
        Map<String, Object> org = new Map<String, Object>();
        org.put('id', userinfo.getOrganizationId());
        org.put('name', userinfo.getOrganizationName());

        return org;
    }

    private String getAuthHash(sFetch_test__SalesFetch__c SFConfig) {
        String targetString = userinfo.getOrganizationId() + userinfo.getUserId() + SFConfig.sFetch_test__master__c + 'SalesFetch4TheWin';
        Blob targetBlob = Blob.valueOf(targetString);
        Blob hashSHA1 = Crypto.generateDigest('SHA1', targetBlob);
        return EncodingUtil.base64encode (hashSHA1);
    }

    private Object retrieveCurrentRecord() {
        Schema.SObjectType convertedType  = Schema.getGlobalDescribe().get(contextType);
        Map<String,Schema.SObjectField> typeFields = convertedType.getDescribe().fields.getMap();
        Set<String> setOfFields = typeFields.keyset();
        List<String> fieldsList = new List<String>(setOfFields);

        String availableFields = '';
        for (Integer i = 0; i < fieldsList.size()-1; i++) {
            availableFields += fieldsList[i] + ',';
        }
        availableFields += fieldsList[fieldsList.size()-1];


        Id convertedId = Id.valueOf(contextId);
        return Database.query('SELECT ' + availableFields + ' FROM '+ contextType + ' WHERE Id= \''+ convertedId + '\'')[0];
    }

    public String getSalesFetchParams() {
        Map<String, Object> params = new Map<String, Object>();
        sFetch_test__SalesFetch__c SFConfig = sFetch_test__SalesFetch__c.getInstance();

        if(SFConfig.sFetch_test__master__c.length()==0) {
            params.put('err', 'No master-key available for the currrent org');
            return (String)JSON.serialize(params);
        }


        params.put('hash', getAuthHash(SFConfig));
        params.put('context-obj', retrieveCurrentRecord());
        params.put('session-id', userinfo.getSessionId());
        params.put('salesfetch-api-url', SFConfig.sFetch_test__SalesFetchURL__c);
        params.put('anyfetch-api-url', SFConfig.sFetch_test__AnyFetchAPI__c);
        params.put('org', getOrgInfos());
        params.put('user', getUserInfos());

        return (String)JSON.serialize(params);
    }
}