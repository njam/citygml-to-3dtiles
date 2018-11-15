#!/usr/bin/env node

import caporal from 'caporal'
import Converter from '../src/Converter.mjs'
import fs from 'fs'

caporal
  .argument('<input-citygml>', 'Input path of CityGML XML file, or folder with multiple files', (path) => {
    if (!fs.existsSync(path)) {
      throw new Error('File does not exist: ' + path)
    }
    return path
  })
  .argument('<output-3dtiles>', 'Output folder where to create 3D-Tiles')
  .action(async function (args, options, logger) {
    let converter = new Converter()
    logger.info('Converting...')
    await converter.convertFiles(args['inputCitygml'], args['output3Dtiles'])
    logger.info('Done.')
  })

caporal.parse(process.argv)
