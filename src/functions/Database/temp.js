var fetchPeriodsIDClient = new Client();
            // set content-type header and data as json in args parameter
            var args = {
                data: { periodname: user.periodname },
                headers: { "Content-Type": "application/json" }
            };

            fetchPeriodsIDClient.get("https://api.octagonafrica.com/v1/accounts/pension/twoway/periodsid", args, function (data, response) {
                if ([200].includes(response.statusCode)) {
                    const periodID = data.data;
                    //update period
                    console.log(periodID);

                    //send member sta
                    var fetchMemberStatements = new Client();
                    // set content-type header and data as json in args parameter
                    var args = {
                        data: { user_id: user.IDNumber, period_id: periodID },
                        headers: { "Content-Type": "application/json" }
                    };
                    fetchMemberStatements.get("https://api.octagonafrica.com/v1/accounts/member_statement", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                          console.log(response.statusCode);
                            const statementsData = data.data;
                            console.log("statements Data .");
                            console.log(statementsData);
                            const name = statementsData.name;
                            const email = statementsData.user_email;
                            console.log(name);
                            console.log(email);
                            const periodsName = statementsData.period_name;
                            sms.send({
                                to: sender,
                                from: '20880',
                                message: "Dear " + name + ".\n Your member statement for " + periodsName + " period has been sent to  " + email
                            });
                        } else if ([400].includes(response.statusCode)) {
                            console.log(response.statusCode);
                        } else if ([500].includes(response.statusCode)) {
                            console.log(response.statusCode);
                        } else {
                            console.log(response.statusCode);
                        }
                    });

                } else if ([400].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else if ([500].includes(response.statusCode)) {
                    console.log(response.statusCode);
                } else {
                    console.log(response.statusCode);
                }
            });

            