node {
    // Create 152 files
    sh 'touch {{a..z},{A..Z},{0..99}}.txt'

    // Archive all files.
    archive '*'
}