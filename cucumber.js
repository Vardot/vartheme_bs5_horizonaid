// cucumber-js configuration for the Horizon Aid theme functional testing suite.
// Loads only the Varbase E2E core step definitions - the suite ships no
// custom steps.
module.exports = {
  default: {
    paths: [process.env.FEATURES || 'tests/features/**/*.feature'],
    require: [
      'node_modules/@vardot/varbase-e2e/tests/step-definitions/**/*.js',
    ],
    format: ['progress-bar', 'json:tests/reports/cucumber_report.json'],
    worldParameters: {
      launchUrl: process.env.LAUNCH_URL || 'http://127.0.0.1:8888',
      minWaitTime: {
        page: 3000,
        before_scenario: 0,
        after_scenario: 0,
        before_step: 0,
        after_step: 0,
      },
      users: {
        webmaster: {
          username: process.env.DRUPAL_ADMIN_USERNAME || 'webmaster',
          password: process.env.DRUPAL_ADMIN_PASSWORD || 'dD.123123ddd',
        },
      },
      screenshots: { onFail: true, path: './tests/screenshots/' },
    },
  },
};
