/**
 * Copyright (c) 2018-present Andrew Vereshchak
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const { Client } = require('pg');
const utils = require('./utils');

class ConnectionManager {
  constructor(connectionConfig, { reconnection, logger }) {
    this._connectionConfig = connectionConfig;
    this._reconnection = reconnection;
    this._logger = logger;
    this.client = null;
  }

  connect(attempt = 0) {
    this.client = new Client(this._connectionConfig);
    return this._connect(attempt);
  }

  _connect(attempt) {
    return this.client.connect().catch(error => {
      if (
        error.code === 'ECONNREFUSED' &&
        this._reconnection &&
        attempt < this._reconnection.attempts
      ) {
        return this._retry(error, attempt);
      } else {
        throw error;
      }
    });
  }

  _retry(error, attempt) {
    const { delay } = this._reconnection;
    attempt += 1;
    this._logger.error(
      error.message +
        '\n' +
        `Reconnection attempt [${attempt}] will be in ${delay} seconds.`
    );
    return this.end()
      .then(() => utils.delay(delay))
      .then(() => this.connect(attempt));
  }

  async end() {
    if (this.client !== null) {
      await this.client.end();
    }
    this.client = null;
  }

  async query(sql, params = []) {
    if (this.client === null) {
      await this.connect();
    }
    return this.client.query(sql, params);
  }

  async transaction(callback, enable) {
    let result;
    if (enable) {
      await this.query('begin');
      try {
        result = await callback();
      } catch (e) {
        await this.query('rollback');
        throw e;
      }
      await this.query('commit');
    } else {
      result = await callback();
    }
    return result;
  }
}

module.exports = ConnectionManager;