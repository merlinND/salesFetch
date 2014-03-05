'use strict';

/**
 * Define the default context profilers
 */
module.exports = [
  {
    object_type: 'Contact',
    query_template: '{{Name}}',
    display_template: '{{Name}}'
  },
  {
    object_type: 'Lead',
    query_template: '{{Name}}',
    display_template: '{{Name}}'
  },
  {
    object_type: 'Account',
    query_template: '{{AccountNumber}}',
    display_template: '{{Name}}'
  }
];