<cfcomponent>
    <cfheader name="Access-Control-Allow-Origin" value="*">
    <cffunction name="adminFunction" access="remote">
        <cfquery name="adminQuery" datasource="ntn_demo">
                SELECT adminID, username, firstName, lastName
                FROM admins 
        </cfquery>

        <cfset response = [] />

        <cfoutput query="adminQuery">
            <cfset obj = {
                "adminID" = adminID,
                "username" = username,
                "firstName" = firstName,
                "lastName" = lastName              
            } />
            <cfset arrayAppend(response, obj) />
        </cfoutput>

        <cfprocessingdirective suppresswhitespace="Yes"> 
            <cfoutput>
                #serializeJSON(response)#
            </cfoutput>
        </cfprocessingdirective>

        <cfsetting enablecfoutputonly="No" showdebugoutput="No">
    </cffunction>
</cfcomponent>