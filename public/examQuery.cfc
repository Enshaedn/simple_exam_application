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
</cfcomponent>