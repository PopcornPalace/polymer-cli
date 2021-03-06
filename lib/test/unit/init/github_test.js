"use strict";
/*
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const helpers = require("yeoman-test");
const github_1 = require("../../../init/github");
/**
 * This small helper function wraps createGithubGenerator() so that we may add a
 * callback to access the github generator before it is run by Yeoman. Yeoman
 * doesn't give us this option otherwise (it takes a generator constructor and
 * creates the generator itself, internally).
 */
function createTestGenerator(generatorOptions, generatorWillRun) {
    return function TestGenerator(args, options) {
        const GithubGenerator = github_1.createGithubGenerator(generatorOptions);
        const githubGenerator = new GithubGenerator(args, options);
        generatorWillRun(githubGenerator);
        return githubGenerator;
    };
}
suite('init/github', () => {
    suite('createGithubGenerator()', () => {
        const semverMatchingRelease = {
            tarball_url: 'MATCHING_RELEASE_TARBALL_URL',
            tag_name: 'MATCHING_RELEASE_TAG_NAME',
        };
        let testName = 'returns a generator that untars the ' +
            'latest release when no semver range is given';
        test(testName, (done) => {
            let getSemverReleaseStub;
            let extractReleaseTarballStub;
            const TestGenerator = createTestGenerator({
                owner: 'Polymer',
                repo: 'shop',
            }, function setupGeneratorStubs(generator) {
                getSemverReleaseStub =
                    sinon.stub(generator._github, 'getSemverRelease')
                        .returns(Promise.resolve(semverMatchingRelease));
                extractReleaseTarballStub =
                    sinon.stub(generator._github, 'extractReleaseTarball')
                        .returns(Promise.resolve());
            });
            helpers.run(TestGenerator).on('end', () => {
                chai_1.assert.isOk(getSemverReleaseStub.calledWith('*'));
                chai_1.assert.isOk(extractReleaseTarballStub.calledWith(semverMatchingRelease.tarball_url));
                done();
            });
        });
        testName = 'returns a generator that untars the latest ' +
            'matching release when a semver range is given';
        test(testName, (done) => {
            const testSemverRange = '^v123.456.789';
            let getSemverReleaseStub;
            let extractReleaseTarballStub;
            const TestGenerator = createTestGenerator({
                owner: 'Polymer',
                repo: 'shop',
                semverRange: testSemverRange,
            }, function setupGeneratorStubs(generator) {
                getSemverReleaseStub =
                    sinon.stub(generator._github, 'getSemverRelease')
                        .returns(Promise.resolve(semverMatchingRelease));
                extractReleaseTarballStub =
                    sinon.stub(generator._github, 'extractReleaseTarball')
                        .returns(Promise.resolve());
            });
            helpers.run(TestGenerator).on('end', () => {
                chai_1.assert.isOk(getSemverReleaseStub.calledWith(testSemverRange));
                chai_1.assert.isOk(extractReleaseTarballStub.calledWith(semverMatchingRelease.tarball_url));
                done();
            });
        });
    });
});
