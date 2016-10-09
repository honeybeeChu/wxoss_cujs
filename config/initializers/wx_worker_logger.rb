worker_logfile = File.open("#{Rails.root}/log/wx_worker_logger.log", 'a')
worker_logfile.sync = true
WORKER_LOG = WxWorkerLogger.new(worker_logfile)