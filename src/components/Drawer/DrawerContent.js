import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { SelectableMenuList } from 'material-ui-selectable-menu-list'
import FontIcon from 'material-ui/FontIcon'
import Toggle from 'material-ui/Toggle'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import withAppConfigs from '../../withAppConfigs'

export const DrawerContent = (props, context) => {
  const {
    responsiveDrawer,
    setResponsive,
    theme,
    locale,
    updateTheme,
    updateLocale,
    intl,
    muiTheme,
    auth,
    dialogs,
    match,
    messaging,
    getMenuItems,
    appConfig,
    isGranted
  } = props

  const isAuthorised = auth.isAuthorised

  const handleChange = (event, index) => {
    const { history, responsiveDrawer, setDrawerOpen } = props

    if (responsiveDrawer.open && index !== undefined) {
      setDrawerOpen(false)
    }

    if (index !== undefined && index !== Object(index)) {
      history.push(index)
    }
  }

  const themeItems = appConfig.themes.map((t) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: t.id }),
      onClick: () => { updateTheme(t.id) },
      rightIcon: <FontIcon
        className='material-icons'
        color={t.id === theme ? muiTheme.palette.primary1Color : undefined}>
        style
      </FontIcon>
    }
  })

  const localeItems = appConfig.locales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => { updateLocale(l.locale) },
      rightIcon: <FontIcon
        className='material-icons'
        color={l.locale === locale ? muiTheme.palette.primary1Color : undefined}>
        language
      </FontIcon>
    }
  })

  const menuItems = appConfig.getMenuItems(props)

  const handleSignOut = () => {
    const { userLogout, setDialogIsOpen, appConfig } = props

    appConfig.firebaseLoad().then(({ firebaseApp }) => {
      this.firebaseApp = firebaseApp

      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/connections`).remove()
      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/notificationTokens/${messaging.token}`).remove()
      firebaseApp.database().ref(`users/${firebaseApp.auth().currentUser.uid}/lastOnline`).set(new Date())
      firebaseApp.auth().signOut().then(() => { setDialogIsOpen('auth_menu', false) })
      userLogout()
    })
  }

  const authItems = [
    {
      value: '/my_account',
      primaryText: intl.formatMessage({ id: 'my_account' }),
      leftIcon: <FontIcon className='material-icons' >account_box</FontIcon>
    },
    {
      value: '/signin',
      onClick: handleSignOut,
      primaryText: intl.formatMessage({ id: 'sign_out' }),
      leftIcon: <FontIcon className='material-icons' >lock</FontIcon>
    }

  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <SelectableMenuList
        items={dialogs.auth_menu ? authItems : menuItems}
        onIndexChange={handleChange}
        index={match ? match.path : '/'}
      />

    </div>

  )
}

export default injectIntl(muiThemeable()(withRouter(withAppConfigs(DrawerContent))))
