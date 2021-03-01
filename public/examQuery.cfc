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

    <!--- function to add a test into the DB, returns new testID --->
    <cffunction  name="examPost" access="remote">
        <cfquery name="examCreate" datasource="ntn_demo" result="result">
            INSERT INTO tests
            (testName, testCreated, testUpdated)
            VALUES
            (<cfqueryparam value="#url.testName#" cfsqltype="cf_sql_varchar">, 
            #createODBCDateTime(NOW())#,
            #createODBCDateTime(NOW())#)
        </cfquery>
        <cfoutput>
            #result.generatedKey#
        </cfoutput>
        <!--- <cfdump  var="#result.generatedKey#"> --->
    </cffunction>

    <!--- function to add entry to testadmins table, linking an admin with a test --->
    <cffunction  name="linkAdminToExam" access="remote">
        <cfquery name="examAdminCreate" datasource="ntn_demo" result="result">
            INSERT INTO testadmins
            (adminID, testID)
            VALUES
            (<cfqueryparam value="#url.adminID#" cfsqltype="cf_sql_integer">,
            <cfqueryparam value="#url.testID#" cfsqltype="cf_sql_integer">)
        </cfquery>
    </cffunction>
</cfcomponent>