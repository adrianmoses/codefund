class SchoolsController < ApplicationController
  #before_action :set_school, :only [:show]

  def show
    respond_to do |format|
      @school = School.find(params[:_id])
      format.json { render json: @school, status: :ok}
    end
  end

  def find_or_create
    @school = School.where(:name => params[:name],
                           :location => params[:location])

    if @school.empty?
      @school = School.new(school_params)
      @school.save
    end
    respond_to do |format|
      format.json { render json: @school, status: :ok }
    end
  end

  private
    def set_school
      @school = School.find(params[:_id])
    end

    def school_params
      params.require(:school).permit(:_id, :name, :location)
    end
end
