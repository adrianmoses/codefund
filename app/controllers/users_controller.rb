require 'redcarpet'
require 'redcarpet/render_strip'
require 'bcrypt'

class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  include BCrypt
  def index
    respond_to do |format|
      @user = User.where(:email => params[:email]).first
      if @user
        password = params[:password]
        is_valid = check_password(@user.password_hash, password)
        if not is_valid
          format.json {render json: {:error => "invalid password" }}
        end
        @user.password_hash = nil
        format.json { render json: @user, status: :ok}
      else
        format.json {render json: {:error => "invalid email/password" }, status: :ok}
      end
    end
  end

  # GET /users/1
  # GET /users/1.json
  def show
    @user = User.find(params[:id])
    @user.password_hash = nil
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create
    new_user_params = user_params
    password = new_user_params
    password_hash = encrypt_password(password)
    new_user_params.delete(:password)
    new_user_params[:password_hash] = password_hash

    @user = User.new(new_user_params)

    respond_to do |format|
      if @user.save
        UserNotifier.send_signup_email(@user).deliver
        format.json { render json: @user, status: :created }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      args = user_params
      markdown = args[:about_me]
      parser = Redcarpet::Markdown.new(Redcarpet::Render::StripDown)
      about_me_stripped = parser.render(markdown)
      args[:about_me_stripped] = about_me_stripped
      if @user.update_attributes(args)
        format.json { render @user, status: :ok }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_password
    respond_to do |format|
      args = user_params
      @user = set_user
      unless args[:password].nil?
         password_hash = Password.create(args[:password])
         args.delete(:password)
         args[:password_hash] = password_hash
         if @user.update_attributes(args)
            format.json { render @user, status: :ok }
         else
            format.json { render json: @user.errors, status: :unprocessable_entity }
         end
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:_id, :name, :email, :photo, :location, :is_student, :school, :has_launched, :about_me, :about_me_html, :about_me_stripped, :password, :linkedin, :website, :github, :campaign_status, :campaign_url)
    end

    def encrypt_password (password)
      password_hash = Password.create(password)
    end

    def check_password(password_hash, password)
      user_pass = Password.new(password_hash)
      user_pass == password
    end
end
