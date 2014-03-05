'use strict';

/**
 * Define the default context profilers
 */
module.exports = [
  {
    record_type: 'Contact',
    query_template: '{{Name}}',
    display_template: '{{Name}}'
  },
  {
    record_type: 'Lead',
    query_template: '{{Name}}',
    display_template: '{{Name}}'
  },
  {
    record_type: 'Account',
    query_template: '{{AccountNumber}}',
    display_template: '{{Name}}'
  }
];