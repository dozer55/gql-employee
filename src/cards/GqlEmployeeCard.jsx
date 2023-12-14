import { Typography } from '@ellucian/react-design-system/core';
import { withStyles } from '@ellucian/react-design-system/core/styles';
import { Icon } from '@ellucian/ds-icons/lib';
import {
    spacing10,
    spacing30,
    spacing40
} from '@ellucian/react-design-system/core/styles/tokens';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
// import { withIntl } from '../utils/ReactIntlProviderWrapper';
// import { useIntl } from 'react-intl';

const styles = () => ({
    card: {
        marginRight: spacing40,
        marginLeft: spacing40,
        paddingTop: spacing10
    },
    list: {
        paddingBottom: spacing40
    },
    formControl: {
        marginTop: spacing10,
        marginBottom: spacing40
    },
    text: {
        marginRight: spacing40,
        marginLeft: spacing40
    },
    iconStyling: {
        marginRight: spacing30,
        verticalAlign: 'middle'
    }
});

const cacheKey = 'graphql-card:Employee';

/**
 * Demonstrates how to use a GraphQL query to make an Ethos request. Uses the SDK's
 * {code}getEthosQuery{code} function
 *
 * It uses the "list-buildings" query defined in this extension's `extension.js` file.
 *
 * @param {Object.<string, *>} props Component props
 * @returns {React.Component}        The Props card
 */
const GqlEmployeeCard = (props) => {
    const {
        classes,
        cardControl: { setLoadingStatus },
        data: { getEthosQuery },
        cache: { getItem, storeItem }
    } = props;
    const [employee, setEmployee] = useState();

    useEffect(() => {
        (async () => {
            setLoadingStatus(true);
            const { data: cachedData, expired: cachedDataExpired = true } =
                await getItem({
                    key: cacheKey,
                    options: { expireTime: 0 }
                });
            if (cachedData) {
                setLoadingStatus(false);
                setEmployee(() => cachedData);
                console.log('fired cache');
            }
            if (cachedDataExpired || cachedData === undefined) {
                try {
                    const employeeData = await getEthosQuery({
                        queryId: 'getEmployee'
                    });
                    const {
                        data: {
                            employees12: { edges: employeeEdges } = []
                        } = {}
                    } = employeeData;
                    console.log(employeeEdges);
                    const employee = employeeEdges.map((edge) => edge.node);
                    setEmployee(() => employee);
                    storeItem({ key: cacheKey, data: employee });
                    setLoadingStatus(false);
                    console.log(employee);
                } catch (error) {
                    console.error('ethosQuery failed', error);
                }
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const bannerId = credentials.filter((cred) => cred.type === "bannerId");

    return (
        <Fragment>
            {employee && (
                <div className={classes.card}>
                    {employee.map((employee) => {
                        var preferredName;
                        var preferred = employee.names.filter(
                            (item) => item.preference === 'preferred'
                        )[0].firstName;
                        if (preferred) {
                            preferredName = preferred;
                        } else {
                            preferredName = employee.names[0].firstName;
                        }
                        return (
                            <Typography
                                key={employee.id}
                                className={classes.text}
                                variant="body1"
                            >
                                <Typography variant="h2">
                                    {/* {persons.names[0].fullName} */}
                                    Welcome {preferredName}
                                </Typography>
                                <hr />
                                <p>
                                    <Icon
                                        name="user"
                                        large="true"
                                        className={classes.iconStyling}
                                    />
                                    {employee.gender}
                                </p>
                                <p>
                                    <Icon
                                        name="email"
                                        large="true"
                                        className={classes.iconStyling}
                                    />
                                    {/* {persons.emails[0].address} */}
                                    {console.log(employee.emails)}
                                    {
                                        employee.emails.filter(
                                            (item) =>
                                                item.preference === 'primary'
                                        )[0].address
                                    }
                                </p>
                                <p>
                                    <Icon
                                        name="address-card"
                                        large="true"
                                        className={classes.iconStyling}
                                    />
                                    {
                                        employee.credentials.filter(
                                            (item) => item.type === 'bannerId'
                                        )[0].value
                                    }
                                </p>
                                <p>
                                    <Icon
                                        name="address-card"
                                        large="true"
                                        className={classes.iconStyling}
                                    />
                                    {
                                        employee.credentials.filter(
                                            (item) =>
                                                item.type === 'bannerUserName'
                                        )[0].value
                                    }

                                    <hr />
                                </p>
                                <p>
                                    {
                                        employee.addresses[0].address11
                                            .addressLines
                                    }
                                    &nbsp;
                                    {
                                        employee.addresses[0].address11.place
                                            .country.city
                                    }
                                    ,{' '}
                                    {
                                        employee.addresses[0].address11.place
                                            .country.region.state
                                    }{' '}
                                    {
                                        employee.addresses[0].address11.place
                                            .country.postalCode
                                    }
                                </p>
                            </Typography>
                        );
                    })}
                </div>
            )}
            {!employee && (
                <Typography className={classes.text} variant="body1">
                    No data loaded
                </Typography>
            )}
        </Fragment>
    );
};

GqlEmployeeCard.propTypes = {
    cardControl: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    cache: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};
export default withStyles(styles)(GqlEmployeeCard);
