<cfcomponent>
    <!--- CORS access to CF / DB --->
    <cfheader name="Access-Control-Allow-Origin" value="*">

    <!--- function to get all admins from the DB in JSON format --->
    <cffunction name="adminGet" access="remote">
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
    
    <!--- function to add an admin into the DB, returns new adminID --->
    <cffunction  name="adminPost" access="remote">
        <cfquery name="adminCreate" datasource="ntn_demo" result="result">
            INSERT INTO admins
            (username, firstName, lastName, adminCreated)
            VALUES
            (<cfqueryparam value="#url.username#" cfsqltype="cf_sql_varchar">, 
            <cfqueryparam value="#url.firstName#" cfsqltype="cf_sql_varchar">, 
            <cfqueryparam value="#url.lastName#" cfsqltype="cf_sql_varchar">, 
            #createODBCDateTime(NOW())#)
        </cfquery>
        <!--- <cfdump  var="#result.generatedKey#"> --->
    </cffunction>

    <!--- function to delete an admin from the DB based on adminID --->
    <cffunction  name="adminDelete" access="remote">
        <cfquery name="adminDelete" datasource="ntn_demo" result="result">
            DELETE FROM admins
            WHERE adminID = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>
        <!--- <cfdump  var="#result#"> --->
    </cffunction>
</cfcomponent>