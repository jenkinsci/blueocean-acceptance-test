node {
    // Create 152 files
    sh '#!/bin/bash \ntouch {{a..z},{A..Z},{0..99}}.txt'

    // Archive all files.
    archive '*'
}