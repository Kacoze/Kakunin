import { create } from './email.service';
import { expect } from 'chai';

describe('Email service', () => {
  it('it returns adapter if found', () => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([fakeAdapter], fakeConfig);

    expect(emailService.getAdapter())
      .to.equal(fakeAdapter);
  });

  it('it throws error if adapter not found', () => {
    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([], fakeConfig);

    expect(() => emailService.getAdapter())
      .to.throw('Could not find email adapter for given configuration.');
  });

  it('it adds adapter', () => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([], fakeConfig);

    expect(() => emailService.getAdapter())
      .to.throw('Could not find email adapter for given configuration.');

    emailService.addAdapter(fakeAdapter);

    expect(emailService.getAdapter())
      .to.equal(fakeAdapter);
  });

  it('it calls adapter clearInbox method', (done) => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true,
      clearInbox: () => Promise.resolve()
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([fakeAdapter], fakeConfig);

    emailService.clearInbox().then(() => done());
  });

  it('it calls adapter getEmails method', (done) => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true,
      getEmails: () => Promise.resolve()
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([fakeAdapter], fakeConfig);

    emailService.getEmails().then(() => done());
  });

  it('it calls adapter markAsRead method', (done) => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true,
      markAsRead: (email) => Promise.resolve(email)
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([fakeAdapter], fakeConfig);

    emailService.markAsRead('some@email.com').then((email) => {
      expect(email).to.be.equal('some@email.com');
      done()
    });
  });

  it('it calls adapter getAttachments method', (done) => {
    const fakeAdapter = {
      isSatisfiedBy: (config) => true,
      getAttachments: (email) => Promise.resolve('some-attachment')
    };

    const fakeConfig = {
      email: {
        type: 'some-service-type'
      }
    };

    const emailService = create([fakeAdapter], fakeConfig);

    emailService.getAttachments('some@email.com').then((attachment) => {
      expect(attachment).to.be.equal('some-attachment');
      done()
    });
  });
});
