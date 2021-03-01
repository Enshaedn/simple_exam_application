<cfcomponent>
    <cfheader name="Access-Control-Allow-Origin" value="*">
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

    <cffunction  name="adminPost" access="remote">
        <cfquery name="adminCreate" datasource="ntn_demo" result="result">
            INSERT INTO admins
            (username, firstName, lastName, adminCreated)
            VALUES
            ('dogeAdmin', 'Jen', 'Clontz', #createODBCDateTime(NOW())#)
        </cfquery>
        <cfdump  var="#result.generatedKey#">
    </cffunction>

    <cffunction  name="adminDelete" access="remote">
        <cfquery name="adminDelete" datasource="ntn_demo" result="result">
            DELETE FROM admins
            WHERE adminID = 2
        </cfquery>
        <cfdump  var="#result#">
    </cffunction>
</cfcomponent>