<cfcomponent>
    <!--- CORS access to CF / DB --->
    <cfheader name="Access-Control-Allow-Origin" value="*">

    <!--- function to get all exams from the DB in JSON format --->
    <cffunction name="examsGet" access="remote">
        <cfquery name="examsQuery" datasource="ntn_demo">
                SELECT testID, testName
                FROM tests
        </cfquery>

        <cfset response = [] />

        <cfoutput query="examsQuery">
            <cfset obj = {
                "testID" = testID,
                "testName" = testName            
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

    <!--- function to get exams associated with specific admin --->
    <cffunction name="adminExams" access="remote">
        <cfquery name="adminExamsQuery" datasource="ntn_demo">
                SELECT adminID, testID
                FROM testAdmins
                WHERE adminID = <cfqueryparam value="#url.id#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfset response = [] />

        <cfoutput query="adminExamsQuery">
            <cfset obj = {
                "adminID" = adminID,
                "testID" = testID            
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