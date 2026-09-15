import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export async function configureNativeUi(theme = 'dark') {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  const backgroundColor =
    theme === 'dark'
      ? '#0e1118'
      : '#f7f8fc'

  try {
    await StatusBar.setOverlaysWebView({
      overlay: false,
    })

    await StatusBar.setBackgroundColor({
      color: backgroundColor,
    })

    await StatusBar.setStyle({
      style:
        theme === 'dark'
          ? Style.Light
          : Style.Dark,
    })
  } catch (error) {
    console.warn(
      'RupeeWise native UI configuration failed:',
      error,
    )
  }
}