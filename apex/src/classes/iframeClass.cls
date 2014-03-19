public class iframeClass{
    public String contextType {get; set;}
    public String contextId {get; set;}
    private sFetch_test__Context_Profiler__c contextProfiler;

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

    private String getAuthHash(sFetch_test__SalesFetch__c SFConfig, Map<String, Object> params) {
        String targetString = userinfo.getOrganizationId() + userinfo.getUserId() + SFConfig.sFetch_test__master__c + (String)JSON.serialize(params) + 'SalesFetch4TheWin';
        Blob targetBlob = Blob.valueOf(targetString);
        Blob hashSHA1 = Crypto.generateDigest('SHA1', targetBlob);
        return EncodingUtil.base64encode (hashSHA1);
    }

    private sObject retrieveCurrentRecord(Set<String> contextAvailableFields) {
        Id convertedId = Id.valueOf(contextId);
        String fieldsString = '';
        for(String f : contextAvailableFields) {
            fieldsString += f + ',';
        }
        fieldsString = fieldsString.substring(0, fieldsString.length()-1);

        return Database.query('SELECT ' + fieldsString + ' FROM '+ contextType + ' WHERE Id= \''+ convertedId + '\'')[0];
    }

    private Set<String> retrieveContextFields () {
        List<sFetch_test__Context_Profiler__c> contextProfilers = Database.query('SELECT sFetch_test__Display_Template__c, sFetch_test__Query_Template__c, sFetch_test__Record_Type__c FROM sFetch_test__Context_Profiler__c WHERE sFetch_test__Record_Type__c = \'' + contextType + '\'');
        if(contextProfilers.isEmpty()) {
            return null;
        }

        contextProfiler = contextProfilers.get(0);
        Set<String> contextAvailableFields = new Set<String>();

        Pattern p = Pattern.compile('[\\{]{2}([^}]*)[\\}]{2}');
        Matcher pm = p.matcher(contextProfiler.sFetch_test__Display_Template__c + contextProfiler.sFetch_test__Query_Template__c);
        while(pm.find()) {
            if(!contextAvailableFields.contains(pm.group(1))) {
                contextAvailableFields.add(pm.group(1));
            }
        }
        return contextAvailableFields;
    }

    private Map<String, String> execTemplate(sObject contextObject, Set<String> contextAvailableFields) {
        String templatedDisplay = contextProfiler.sFetch_test__Display_Template__c;
        String templatedQuery = contextProfiler.sFetch_test__Query_Template__c;

        for(String f : contextAvailableFields) {
            String reg = '\\{\\{' + f + '\\}\\}';
            String s = (String)contextObject.get(f);

            templatedDisplay = templatedDisplay.replaceAll(reg, s);
            templatedQuery = templatedQuery.replaceAll(reg, s);
        }

        Map<String, String> ret = new Map<String, String>();
        ret.put('templated-display', templatedDisplay);
        ret.put('templated-query', templatedQuery);
        return ret;
    }

    public String getSalesFetchParams() {
        Map<String, Object> params = new Map<String, Object>();
        sFetch_test__SalesFetch__c SFConfig = sFetch_test__SalesFetch__c.getInstance();

        if(SFConfig.sFetch_test__master__c.length()==0) {
            params.put('err', 'No master-key available for the currrent org');
            return (String)JSON.serialize(params);
        }

        Set<String> fields = retrieveContextFields();
        sObject contextObj = retrieveCurrentRecord(fields);

        params.put('context', execTemplate(contextObj, fields));
        params.put('session-id', userinfo.getSessionId());
        params.put('salesfetch-api-url', SFConfig.sFetch_test__SalesFetchURL__c);
        params.put('anyfetch-api-url', SFConfig.sFetch_test__AnyFetchAPI__c);
        params.put('org', getOrgInfos());
        params.put('user', getUserInfos());
        params.put('hash', getAuthHash(SFConfig, params));


        return (String)JSON.serialize(params);
    }
}