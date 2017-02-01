node {

//
// Commented out for now because pipeline doesn't accept Job parameters
// on the first run of the Job, which seems a bit messed up. The actual
// components for processing the inputs are the same in both cases, so
// testing the inputs should be fine for now anyway.
//
//    properties([
//            parameters([
//                    booleanParam(
//                            defaultValue: false,
//                            description: 'My <b>flag</b>',
//                            name: 'My <b>flag</b>'
//                    ),
//                    choice(
//                            choices: 'master\ndevelopment\nfeatureXYZ\nhotfix69\nrevolution\nrefactor\nuglify',
//                            description: 'My <b>choice</b>',
//                            name: 'My <b>choice</b>'
//                    ),
//            ])
//    ])
//

    input message: 'Some <b>inputs</b>', parameters: [
            [name: 'My <b>text</b>.', description: 'My text <b>description</b>.', $class: 'StringParameterDefinition'],
            [name: 'My <b>choice</b>.', description: 'My choice <b>description</b>.', choices: 'Choice 1\nChoice 2\nChoice 3', $class: 'ChoiceParameterDefinition'],
            [name: 'My <b>flag</b>.', description: 'My flag <b>description</b>.', $class: 'BooleanParameterDefinition'],
            [name: 'My <b>password</b>.', description: 'My password <b>description</b>.', $class: 'PasswordParameterDefinition']
    ]
}