class WxOfficialAccountsController < ApplicationController
  layout 'application'
  before_action :set_wx_official_account, only: [:show, :edit, :update, :destroy, :get_resources, :get_users]

  def getAccountList
    render json: {"list" => WxOfficialAccount.all, "sessionAccountid" => session[:current_official_account_id]}
  end

  def setOfficialAccount2Session
    session[:current_official_account_id] = params[:current_official_account_id]
    @current_wx_official_account = WxOfficialAccount.find(params[:current_official_account_id])
    session[:current_official_account_wechat_name] = @current_wx_official_account.wechat_name

    render json: {"result" => "ok", status => "200 ok"}
  end

  # GET /wx_official_accounts
  # GET /wx_official_accounts.json
  def index
    @name = params[:search_name]
    if @name == nil || @name == ''
      @current_wx_official_account = WxOfficialAccount.all
      @search_name = '请输入公众号名称'
    else
      @current_wx_official_account = WxOfficialAccount.where("wechat_name LIKE '%#{@name}%'")
      @search_name = @name
    end
  end

  # GET /wx_official_accounts/1
  # GET /wx_official_accounts/1.json
  def show
    @wx_official_account.client

  end

  # GET /wx_official_accounts/new
  def new
    @wx_official_account = WxOfficialAccount.new

  end

  # GET /wx_official_accounts/1/edit
  def edit
  end

  # POST /wx_official_accounts
  # POST /wx_official_accounts.json
  def create
    @wx_official_account = WxOfficialAccount.new(wx_official_account_params)

    respond_to do |format|
      if @wx_official_account.save
        format.html { redirect_to @wx_official_account, notice: 'Wx official account was successfully created.' }
        format.json { render :show, status: :created, location: @wx_official_account }
      else
        format.html { render :new }
        # format.json { render json: @wx_official_account.errors.messages, status: :unprocessable_entity }
        # render :new
      end
    end
  end

  def update
    respond_to do |format|
      if @wx_official_account.update(update_wx_official_account_params)
        format.html { redirect_to @wx_official_account, notice: 'Wx official account was successfully updated.' }
        format.json { render :show, status: :ok, location: @wx_official_account }
      else
        format.html { render :edit }
        format.json { render json: @wx_official_account.errors, status: :unprocessable_entity }
      end
    end
  end

  def get_resources
    count_return = @wx_official_account.wx_get(GET_MATERIALCOUNT)
    WxResource.wx_data_pull(@wx_official_account, count_return.result[:image_count])
    WxArticle.wx_data_pull(@wx_official_account, count_return.result[:news_count])
    @wx_official_account.update(:resource_flag => 1)
    render :json => {:err_msg => '获取成功'}
  end

  def get_users
    WxUser.wx_data_pull(@wx_official_account)
    WxUserGroup.wx_data_pull(@wx_official_account)
    render :json => {:err_msg => '获取成功'}
  end

  # DELETE /wx_official_accounts/1
  # DELETE /wx_official_accounts/1.json
  def destroy
    account_id = @wx_official_account.id
    if @wx_official_account.destroy
      session[account_id] = nil
    end
    respond_to do |format|
      format.html { render :text => '' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_wx_official_account
    @wx_official_account = WxOfficialAccount.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def wx_official_account_params
    params.require(:wx_official_account).permit(:wechat_name, :original_id, :wechat_type, :wechat_account, :app_id, :app_secret,:wx_m_enterpriseclient_id)
  end

  def update_wx_official_account_params
    params.require(:wx_official_account).permit(:wechat_name, :original_id, :wechat_type, :wechat_account)
  end
end
