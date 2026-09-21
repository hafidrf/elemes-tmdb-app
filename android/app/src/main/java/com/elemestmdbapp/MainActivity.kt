package com.elemestmdbapp

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ElemesTmdbApp"

  /**
   * Swaps the launch theme (`SplashTheme`, set in AndroidManifest) for the real
   * app theme as soon as the activity starts. This is what makes the native
   * splash screen disappear and the React UI appear.
   *
   * `super.onCreate(null)` is intentional: passing a null bundle stops Android
   * from restoring the previous fragment state, which is the documented
   * requirement when a React Native app owns the view hierarchy.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.AppTheme)
    super.onCreate(null)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
