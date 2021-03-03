<cfcomponent>
    <!--- CORS access to CF / DB --->
    <cfheader name="Access-Control-Allow-Origin" value="*">

    <!--- function to add question to exam --->
    <cffunction  name="questionPost" access="remote">
        <cfquery name="questionCreate" datasource="ntn_demo" result="result">
            INSERT INTO questions
            (testID, adminID, question, questionType, numOptions, questionCreated, questionUpdated)
            VALUES
            (<cfqueryparam value="#url.testID#" cfsqltype="cf_sql_integer">, 
            <cfqueryparam value="#url.adminID#" cfsqltype="cf_sql_integer">,
            <cfqueryparam value="#url.question#" cfsqltype="cf_sql_varchar">,
            <cfqueryparam value="#url.questionType#" cfsqltype="cf_sql_varchar">,
            <cfqueryparam value="#url.numOptions#" cfsqltype="cf_sql_integer">,
            #createODBCDateTime(NOW())#,
            #createODBCDateTime(NOW())#)
        </cfquery>
        <cfoutput>
            #result.generatedKey#
        </cfoutput>
    </cffunction>

    <!--- function to get all questions associated with an exam from the DB in JSON format --->
    <cffunction name="examQuestionsGet" access="remote">
        <cfquery name="questionsQuery" datasource="ntn_demo">
                SELECT questionID, testID, question, questionType, numOptions
                FROM questions
                WHERE testID = <cfqueryparam value="#url.testID#" cfsqltype="cf_sql_integer">
        </cfquery>

        <cfset response = [] />

        <cfoutput query="questionsQuery">
            <cfset obj = {
                "questionID" = questionID,
                "testID" = testID,
                "question" = question,
                "questionType" = questionType,
                "numOptions" = numOptions        
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