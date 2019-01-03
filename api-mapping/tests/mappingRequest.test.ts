import { requestMapping } from '../src/mapper';

describe('mapping request github issue create', () => {
  const mapping = {
    url: 'https://api.github.com',
    path: ['repos', '$.object.author.name', '$.object.name', 'issues'],
    headers: {
      Authorization: "$.agent.identifier |> (i => 'token ' + i)",
    },
    body: {
      title: '$.result.name',
      body: '$.result.description',
      labels: '$.result.genre',
    },
  };
  it('1st', () => {
    const inputAction = {
      '@context': 'http://schema.org/',
      '@type': 'CreateAction',
      name: 'Create Issues in repository',
      agent: {
        '@type': 'Person',
        identifier: '123',
      },
      object: {
        '@type': 'SoftwareSourceCode',
        name: 'Try1',
        author: {
          '@type': 'Person',
          name: 'ThibaultGerrier',
        },
      },
      result: {
        '@type': 'PublicationIssue',
        name: 'Title 1',
        description: 'Body 1',
        genre: ['bug', 'test'],
      },
    };
    const expectedRequest = {
      url: 'https://api.github.com/repos/ThibaultGerrier/Try1/issues',
      headers: {
        Authorization: 'token 123',
      },
      body: {
        title: 'Title 1',
        body: 'Body 1',
        labels: ['bug', 'test'],
      },
    };

    expect(requestMapping(inputAction, mapping)).toEqual(expectedRequest);
    expect(
      requestMapping(inputAction, mapping, {
        evalMethod: 'vm-runInNewContext',
      }),
    ).toEqual(expectedRequest);
  });
});

describe('mapping request github issue list', () => {
  const mapping = {
    url: 'https://api.github.com',
    path: ['repos', '$.object.author.name', '$.object.name', 'issues'],
  };

  it('1st', () => {
    const inputAction = {
      '@context': 'http://schema.org/',
      '@type': 'FindAction',
      object: {
        '@type': 'SoftwareSourceCode',
        name: 'Try1',
        author: {
          '@type': 'Person',
          name: 'ThibaultGerrier',
        },
      },
    };
    const expectedRequest = {
      url: 'https://api.github.com/repos/ThibaultGerrier/Try1/issues',
    };

    expect(requestMapping(inputAction, mapping)).toEqual(expectedRequest);
  });
});