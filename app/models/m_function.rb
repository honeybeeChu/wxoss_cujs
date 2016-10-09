class MFunction < ActiveRecord::Base

  def self.getMeaus(funclist)

    menufs=Hash.new
    funclist.each do |tmpfunc|
      funcid=tmpfunc.fetch("funcid");
      func=self.find_by_funcid(funcid)
      if func.nil?
        raise "Func("+funcid+")'s is not found."
      end
      url=func.indexurl
      if url.nil? or url.empty?
        next
      end
      menuf=MMenuFunction.find_by_funcid(funcid)
      if menuf.nil?
        raise "Func("+funcid+")'s menu is not found."
      end
      menufs.store(menuf.nodeid,func);
    end


    menu=Hash.new
    menufs.keys.each do |nodeid|
      menutree=MMenuTree.find_by_nodeid(nodeid)
      if menutree.nil?
        raise "Nodeid("+nodeid+")'s menutree is not found."
      end
      parentnodeid=menutree.parentnodeid
      if menutree.nil?
        raise "Nodeid("+nodeid+")'s menutree is not found."
      end
      getMenuTree(nodeid,menu,menufs.fetch(nodeid))
    end
    return  menu
  end


  private
  def self.getMenuTree(nodeid,menu,func)

      menutree=MMenuTree.find_by_nodeid(nodeid)
      if menutree.nil?
        raise "Nodeid("+nodeid+")'s menutree is not found."
      end
      nodetype=menutree.nodetype
      parentnodeid=menutree.parentnodeid
      if nodetype !=0
        tmpMenu=getMenuTree(parentnodeid,menu,func)
        if nodetype == 3
          tmpMenu.store(nodeid,{"name"=>menutree.label,"nodetype"=>nodetype,"icon"=>menutree.info,"url"=>func.indexurl})
          return nil
        elsif !tmpMenu.has_key?(nodeid)
            clildList=Hash.new
            tmpMenu.store(nodeid,{"name"=>menutree.label,"nodetype"=>nodetype,"icon"=>menutree.info,"clildList"=>clildList})
            return clildList
        else
          return tmpMenu.fetch(nodeid).fetch("clildList")
        end
      else
        if !menu.has_key?(nodeid)
          clildList=Hash.new
          menu.store(nodeid,{"name"=>menutree.label,"nodetype"=>nodetype,"icon"=>menutree.info,"clildList"=>clildList})
          return clildList
        else
          return menu.fetch(nodeid).fetch("clildList")
        end
      end

  end
end
