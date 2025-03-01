#[[
 usage cmake -D CMAKE_BUILD_TYPE=(Debug | Release | '') -DCMAKE_EXPORT_COMPILE_COMMANDS=on -DCMAKE_VERBOSE_MAKEFILE:BOOL=TRUE
 -DMAKE_TEST=1 we will compile test and sample code
]]
cmake_minimum_required(VERSION 3.24)
enable_testing()
#[[
    FRCL is Fake Reactivity Component oriented Libray (! FRancium ChLoride && ! Frequent Replacement Contact Lens)
]]
file(STRINGS VERSION FRCL_VERSION_LINE)
string(REGEX MATCH "([0-9]+\\.?)+" FRCL_VERSION ${FRCL_VERSION_LINE})
set(TARGET frcl)

message("${TARGET} version is ${FRCL_VERSION}")

project("${TARGET}"
  VERSION ${FRCL_VERSION}
  LANGUAGES NONE)



set(FRCL_ROOT_NAME ${TARGET})
set(FRCL_ROOT_DIRECTORY ${PROJECT_SOURCE_DIR})
set(FRCL_BUILD_DIRECTORY ${PROJECT_BINARY_DIR})
## output directories
set(FRCL_OUTPUT_ROOT ${FRCL_ROOT_DIRECTORY}/dist)
#
option(FRCL_RUN_TEST "Test for client side" OFF)

## create package.json from package.json.in
CONFIGURE_FILE ("${FRCL_ROOT_DIRECTORY}/package.json.in" "${FRCL_ROOT_DIRECTORY}/package.json")

#
##
#
add_custom_target(
  COMMAND npm run dev
  WORKING_DIRECTORY ${FRCL_ROOT_DIRECTORY}
  COMMENT "Running developing environment..."
  )
#
##
#
add_custom_target(build
  COMMAND npm run build
  WORKING_DIRECTORY ${FRCL_ROOT_DIRECTORY}
  COMMENT "Building ..."
)
#
##
#
add_custom_target(unit
  COMMAND npm run dtest
  WORKING_DIRECTORY ${FRCL_ROOT_DIRECTORY}
  COMMENT "Testing ..."
)
#
##
#
add_test(
  NAME core_test
  COMMAND npm run test
  WORKING_DIRECTORY ${FRCL_ROOT_DIRECTORY}
)

























cmake_minimum_required(VERSION 3.24)
set(TARGET_CS ems-cs)
project("${TARGET_CS}"
  VERSION ${FRCL_VERSION}
  LANGUAGES NONE)
## install node_modules for building client side code
add_custom_target(install-dep
  COMMAND ${FRCL_SCRIPTS_DIRECTORY}/install-node.sh
  WORKING_DIRECTORY ${FRCL_CS_ROOT}
  COMMENT "Installing js dependency"
  )
## build client side code (make ems-cs)
add_custom_target(${TARGET_CS}
  COMMAND npm run build
  WORKING_DIRECTORY ${FRCL_CS_ROOT}
  DEPENDS "install-dep"
  COMMENT "Building ems client side"
  )
## (make cs-move)
add_custom_target(cs-move
  COMMAND mv ${FRCL_CS_ROOT}/dist ${FRCL_OUTPUT_ROOT}/cs
  DEPENDS ${TARGET_CS}
  COMMENT "Moving client side code"
  )
