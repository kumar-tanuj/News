// ============================================
// FILE: js/data.js
// ============================================

const DataPage = {
  relationshipId: null,

  init(data) {
    this.relationshipId = data.relationshipId;
    // Setup back button
    document.getElementById('data-back-btn').addEventListener('click', (e) => {
      App.loadPage('detail', { relationshipId: this.relationshipId });
    });

    // Setup add new row button
    document.getElementById('add-new-row-btn').addEventListener('click', () => {
      this.openEditModal();
    });

    // Setup save edit button
    document.getElementById('save-edit-btn').addEventListener('click', () => {
      this.saveEdit();
    });

    // Setup export to excel button
    document.getElementById('export-excel-btn').addEventListener('click', () => {
      this.exportToExcel();
    });

    this.loadRelationships();
    this.loadTableData();
  },

  async loadRelationships() {
    try {
      this.relationships = await SupabaseService.getRelationships();
      this.populateRelationshipSelect();
    } catch (error) {
      console.error('Error loading relationships:', error);
    }
  },

  populateRelationshipSelect() {
    const select = document.getElementById('edit-relationship-id');
    select.innerHTML = '';
    this.relationships.forEach(rel => {
      const option = document.createElement('option');
      option.value = rel.id;
      option.textContent = rel.name;
      select.appendChild(option);
    });
  },

  async loadTableData() {
    try {
      const { data, error } = await SupabaseService.client
        .from('country_monitored_relationships')
        .select(`
          *,
          relationships (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.tableData = data || [];
      this.displayTable();
    } catch (error) {
      console.error('Error loading table data:', error);
      document.getElementById('data-table-body').innerHTML = '<tr><td colspan="12" class="text-center text-danger">Error loading data</td></tr>';
    }
  },

  displayTable() {
    const tbody = document.getElementById('data-table-body');
    tbody.innerHTML = '';

    if (this.tableData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="12" class="text-center">No data available</td></tr>';
      return;
    }

    this.tableData.forEach((row, index) => {
      const tr = document.createElement('tr');
      const relationshipName = row.relationships ? row.relationships.name : 'N/A';
      
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${relationshipName}</td>
        <td>${row.column_1 || ''}</td>
        <td>${row.column_2 || ''}</td>
        <td>${row.column_3 || ''}</td>
        <td>${row.column_4 || ''}</td>
        <td>${row.column_5 || ''}</td>
        <td>${row.column_6 || ''}</td>
        <td>${row.column_7 || ''}</td>
        <td>${row.column_8 || ''}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${row.id}" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.editRow(id);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.deleteRow(id);
      });
    });
  },

  openEditModal(rowId = null) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const modalTitle = document.querySelector('#editModal .modal-title');
    
    document.getElementById('edit-id').value = rowId || '';
    
    if (rowId) {
      modalTitle.textContent = 'Edit Row';
      const row = this.tableData.find(r => r.id == rowId);
      if (row) {
        document.getElementById('edit-relationship-id').value = row.relationship_id;
        document.getElementById('edit-column-1').value = row.column_1 || '';
        document.getElementById('edit-column-2').value = row.column_2 || '';
        document.getElementById('edit-column-3').value = row.column_3 || '';
        document.getElementById('edit-column-4').value = row.column_4 || '';
        document.getElementById('edit-column-5').value = row.column_5 || '';
        document.getElementById('edit-column-6').value = row.column_6 || '';
        document.getElementById('edit-column-7').value = row.column_7 || '';
        document.getElementById('edit-column-8').value = row.column_8 || '';
      }
    } else {
      modalTitle.textContent = 'Add New Row';
      // Clear form for new row and pre-select current relationship
      document.getElementById('edit-form').reset();
      document.getElementById('edit-relationship-id').value = this.relationshipId;
    }
    
    modal.show();
  },

  async saveEdit() {
    const id = document.getElementById('edit-id').value;
    const data = {
      relationship_id: parseInt(document.getElementById('edit-relationship-id').value),
      column_1: document.getElementById('edit-column-1').value,
      column_2: document.getElementById('edit-column-2').value,
      column_3: document.getElementById('edit-column-3').value,
      column_4: document.getElementById('edit-column-4').value,
      column_5: document.getElementById('edit-column-5').value,
      column_6: document.getElementById('edit-column-6').value,
      column_7: document.getElementById('edit-column-7').value,
      column_8: document.getElementById('edit-column-8').value,
    };

    try {
      if (id) {
        // Update
        const { error } = await SupabaseService.client
          .from('country_monitored_relationships')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await SupabaseService.client
          .from('country_monitored_relationships')
          .insert([data]);
        if (error) throw error;
      }

      // Close modal and reload data
      const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
      modal.hide();
      this.loadTableData();
    } catch (error) {
      console.error('Error saving:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Error saving data: ' + error.message,
        icon: 'error',
        background: '#343a40',
        color: '#ffffff'
      });
    }
  },

  async deleteRow(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#343a40',
      color: '#ffffff'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await SupabaseService.client
        .from('country_monitored_relationships')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await Swal.fire({
        title: 'Deleted!',
        text: 'The row has been deleted.',
        icon: 'success',
        background: '#343a40',
        color: '#ffffff',
        timer: 1500,
        showConfirmButton: false
      });
      
      this.loadTableData();
    } catch (error) {
      console.error('Error deleting:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Error deleting row: ' + error.message,
        icon: 'error',
        background: '#343a40',
        color: '#ffffff'
      });
    }
  },

  editRow(id) {
    this.openEditModal(id);
  },

  exportToExcel() {
    if (this.tableData.length === 0) {
      Swal.fire({
        title: 'No Data',
        text: 'There is no data to export',
        icon: 'info',
        background: '#343a40',
        color: '#ffffff'
      });
      return;
    }

    // Prepare data for export
    const exportData = this.tableData.map((row, index) => {
      const relationshipName = row.relationships ? (row.relationships.name) : 'N/A';
      return {
        'S.No': index + 1,
        'Relationship': relationshipName,
        'Column 1': row.column_1 || '',
        'Column 2': row.column_2 || '',
        'Column 3': row.column_3 || '',
        'Column 4': row.column_4 || '',
        'Column 5': row.column_5 || '',
        'Column 6': row.column_6 || '',
        'Column 7': row.column_7 || '',
        'Column 8': row.column_8 || '',
        'Created At': new Date(row.created_at).toLocaleString()
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Country Monitored Relationships');
    
    // Generate filename with current date
    const now = new Date();
    const filename = `country_monitored_relationships_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
  }
};