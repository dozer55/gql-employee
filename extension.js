module.exports = {
    name: 'GqlEmployee',
    publisher: 'Ellucian Professional Services',
    group: 'EPS',
    cards: [
        {
            type: 'GqlEmployeeCard',
            source: './src/cards/GqlEmployeeCard',
            title: 'GqlEmployee Card',
            displayCardType: 'GqlEmployee Card',
            description: 'GraphQL Employee Query Card',
            queries: {
                getEmployee: [
                    {
                        resourceVersions: {
                            employees: { min: 12 }
                        },
                        query: `query getEmployee($personId: ID) {
                            employees12 (
                                filter: { person12: { id: { EQ: $personId } } }
                            ) 
                            {
                                edges {
                                    node {
                                        id
                                        person12 {
                                            names {
                                                fullName
                                            }
                                            gender
                                            dateOfBirth
                                            emails {
                                                type {
                                                    emailType
                                                }
                                                address
                                            }
                                        }
                                    }
                                }
                            }
                        }`
                    }
                ]
            },
            pageRoute: {
                route: '/',
                excludeClickSelectors: ['a']
            }
        }
    ],
    page: {
        source: './src/page/router.jsx'
    }
};
